## Set up postgres
* set up commands
  ```
  aws ecs register-task-definition --cli-input-yaml file://aws-elastic-container-service/postgres/postgres.task.definition.yaml --no-cli-pager
  aws ecs create-service --service-name postgres --cli-input-yaml file://aws-elastic-container-service/postgres/postgres-create.service.yaml --no-cli-pager
  ```
* update
  ```
  aws ecs register-task-definition --cli-input-yaml file://aws-elastic-container-service/postgres/postgres.task.definition.yaml --no-cli-pager
  aws ecs update-service --service postgres --cli-input-yaml file://aws-elastic-container-service/postgres/postgres-update.service.yaml --no-cli-pager
  ```