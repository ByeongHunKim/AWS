# 1. install aws-cli
- `$ brew install awscli`

## 1.1 aws configure
- for using several profile
- `$ aws configure --profile [profile name]`
  - `$ export AWS_PROFILE=[profile name]`

### 1.1.1 [reference link](https://inpa.tistory.com/entry/AWS-%F0%9F%93%9A-AWS-CLI-%EC%84%A4%EC%B9%98-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%89%BD%EA%B3%A0-%EB%B9%A0%EB%A5%B4%EA%B2%8C)

# 2. create ECS cluster
- `$ aws ecs create-cluster --cli-input-json file://ecs-cluster.json`

### 2.1.1 [reference link](https://docs.aws.amazon.com/cli/latest/reference/ecs/create-cluster.html)