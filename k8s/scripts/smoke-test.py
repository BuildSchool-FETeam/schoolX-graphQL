import requests
import sys
import os
import time

list_args = sys.argv
print(list_args)
if (len(list_args) != 3):
    print("Please provide env argument (prod|dev|staging) and testserver(mini-js|mini-java|...)")
    sys.exit(1)

cluster_env = list_args[1]
test_server = list_args[2]
endpoint = f"http://gql.prisdom-{cluster_env}.online/graphql"

password = os.environ['GQL_ADMIN_PASSWORD']
adminMutation = """
  mutation {
    adminAuthMutation{
      signIn(data:{
        email:"tpc.techlab@gmail.com"
        password: "<<password>>"
      }) {
        token
      }
    }
  }
""".replace('<<password>>', password)

print("Admin login")
response = requests.post(endpoint, json={"query": adminMutation})

responseData = response.json()
print(responseData)
token = response.json()['data']['adminAuthMutation']['signIn']['token']

heartBeatAuth = """
  query {
    heartBeatWithAuth
  }
"""
headers = {"Authorization": f"Bearer {token}"}

print("Checking authentication guard...")
response = requests.post(
    endpoint, json={"query": heartBeatAuth}, headers=headers)

# Check mini server
server_check_query = """
  mutation {
    lessonMutation {
      runCode(code: "<<code>>", language: <<language>>) {
        result
        executeTime
        }
    }
  }
"""
print(response.json())

print("Smoking test mini-server...")


def replace_var(code, lang):
    return server_check_query.replace('<<code>>', code).replace('<<language>>', lang)


java_code = r'public class Main {\r\n\r\n    public static void main(String[] args) {\r\n\r\n        // println() prints the following line to the output screen\r\n        System.out.println(\"Hello Java\");\r\n    }\r\n}\r\n'
cpp_code = r'#include <iostream>\r\n\r\nint main() {\r\n    std::cout << \"Hello CPP!\";\r\n    return 0;\r\n}'


def get_query():
    test_servers = {
        'mini-js': lambda: replace_var('console.log(\'Hello JS\')', 'javascript'),
        'mini-python': lambda: replace_var('print(\'Hello Python\')', 'python'),
        'mini-java': lambda: replace_var(java_code, 'java'),
        'mini-cpp': lambda: replace_var(cpp_code, 'CPlus')
    }

    return test_servers[test_server]()


backoff_limit = 4
backoff = 0
delay_time = 7  # seconds

response = requests.post(
    endpoint, json={"query": get_query()}, headers=headers)

print(response.json())
print(response.status_code)
while (response.status_code != 200):
    if (backoff == backoff_limit):
        print(f"Failed smoke test after trying {backoff_limit} times")
        break
    print(f"Try to smoke test - {backoff} times after {delay_time} seconds...")
    time.sleep(delay_time)
    response = requests.post(
        endpoint, json={"query": get_query()}, headers=headers)
    backoff += 1


data = response.json()['data']['lessonMutation']['runCode']['result'][0]


def assert_result(expect, error_msg):
    assert data == expect, error_msg
    print('Mini-server assertion passed')


smoke_results = {
    'mini-js': lambda: assert_result('Hello JS', 'Mini JS server smoke test failed'),
    'mini-python': lambda: assert_result('Hello Python', 'Mini python server smoke test failed'),
    'mini-java': lambda: assert_result('Hello Java', 'Mini java server smoke test failed'),
    'mini-cpp': lambda: assert_result('Hello CPP!', 'Mini cpp server smoke test failed')
}[test_server]()
