#!/bin/bash

# 전달받은 인자를 변수에 할당
SOURCE_REGION=$1
KEYWORD=$2

# 인자가 모두 전달되었는지 확인
if [ -z "$SOURCE_REGION" ] || [ -z "$KEYWORD" ]; then
    echo "Usage: $0 <source_region> <keword>"
    exit 1
fi

# 서울 리전의 시크릿 목록 가져오기
secrets=$(aws secretsmanager list-secrets --region $SOURCE_REGION --query "SecretList[?contains(Name, '$KEYWORD')].Name" --output text)

# 시크릿 목록을 배열로 변환
secret_array=($secrets)

# 조회된 시크릿 개수
count=${#secret_array[@]}

# 조회된 시크릿 출력
echo "조회된 시크릿 개수: $count"
echo "조회된 시크릿:"
for secret in "${secret_array[@]}"; do
    echo "$secret"
done
