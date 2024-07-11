#!/bin/bash

# 전달받은 인자를 변수에 할당
SOURCE_REGION=$1
DESTINATION_REGION=$2
KEYWORD=$3

# 인자가 모두 전달되었는지 확인
if [ -z "$SOURCE_REGION" ] || [ -z "$DESTINATION_REGION" ] || [ -z "$KEYWORD" ]; then
    echo "Usage: $0 <source_region> <destination_region> <keyword>"
    exit 1
fi

# 서울 리전의 시크릿 목록 가져오기
secrets=$(aws secretsmanager list-secrets --region $SOURCE_REGION --query "SecretList[?contains(Name, '$KEYWORD')].Name" --output text)

# 각 시크릿을 싱가포르 리전으로 복제
for secret in $secrets; do
    echo "복제 중: $secret"
    aws secretsmanager replicate-secret-to-regions \
        --secret-id $secret \
        --add-replica-regions Region=$DESTINATION_REGION \
        --region $SOURCE_REGION \
        --output json > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "성공: $secret 복제 완료"
    else
        echo "실패: $secret 복제 중 오류 발생"
    fi

    sleep 1 # 1초 대기
done

echo "모든 시크릿 복제 작업이 완료되었습니다."
