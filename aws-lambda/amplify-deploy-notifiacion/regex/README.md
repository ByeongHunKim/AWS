# regex
- 정규 표현식은 문자열을 검색하거나 매치하는 패턴을 정의하는 데 사용되는 도구.
- `JavaScript` 에서 정규 표현식 패턴을 정의할 때, 이를 / (슬래시)로 감싸게 된다
  - e.g
    ```markdown
    /apple/ : 문자열 "apple"을 찾는 정규 표현식
    /[0-9]/ : 숫자 하나를 찾는 정규 표현식
    ```
---

## match 메서드
- 각 match 메서드는 일치하는 결과를 배열 형태로 반환하거나, 일치하는 내용이 없으면 null을 반환
- 배열의 첫 번째 요소는 전체 일치 항목이며, 그 이후의 요소는 캡처 그룹에 해당하는 내용

---
    
## 정규표현식에 사용했던 rawMessage
```markdown
"Build notification from the AWS Amplify Console for app: https://development.blahblah.amplifyapp.com/. Your build status is SUCCEED. Go to https://console.aws.amazon.com/amplify/home?region=ap-northeast-2#blahblah/development/39 to view details on your build. "
```
---

## Status Match
```javascript
const statusMatch = rawMessage.match(/Your build status is (\w+)./);
/**
 * (\w+): \w는 단어 문자(word character)를 나타내며, [a-zA-Z0-9_]와 동일
 * +는 이전의 문자나 그룹이 하나 또는 그 이상 반복됨을 나타냅니다. 따라서, (\w+)는 하나 이상의 연속된 단어 문자들을 캡처하는 그룹
 이 정규식은 문자열에서 "Your build status is " 뒤에 오는 연속된 단어 문자들을 찾아낸다.
 예를 들면, "STARTED", "SUCCEED", "FAILED"와 같은 상태를 캡처
 */
```
### /Your build status is (\w+)./ 라는 패턴을 해석해보면:
    - Your build status is : "Your build status is " 라는 글자를 찾습니다
    - (\w+) : 여기서 \w는 알파벳, 숫자, 밑줄(underscore) 중 하나의 문자를 의미하고, 
    - +는 그런 문자가 하나 이상 반복된다는 것을 의미
    - 괄호 ( )는 그룹을 만들고, 해당 그룹에 매칭된 부분을 캡처.
      - 즉, "Your build status is " 다음에 오는 연속된 단어 문자들을 캡처
    - . : 정규 표현식에서 .는 모든 문자를 의미하는 와일드카드 
        - 그러나 여기서는 그냥 문자열에 있는 마침표(.)를 의미
    이 정규 표현식은 결국 `"Your build status is"`라는 문자열 다음에 오는 단어들을 매치하고 그 단어들을 캡처하게 된다
    - 예시:
      - `"Your build status is STARTED." => STARTED를 캡처`
      - `"Your build status is FAILED." => FAILED를 캡처`

## URL Match
```javascript
const urlMatch = rawMessage.match(/Go to (https:\/\/console\.aws\.amazon\.com\/.+?) to view details/);
/**
 * https:\/\/: "https://" 문자열을 찾는다 
 *  - https:\/\/ : 여기서 https:는 그대로의 문자열 "https:"를 찾는 것을 의미
 *  - 그런데 // 부분에서 \가 두 번 나온 이유는, 
 *  - / 슬래시도 정규 표현식에서 특별한 의미를 가지므로, 문자 그대로의 슬래시를 찾고 싶을 때 역슬래시 \를 사용하여 \/로 표현해야한다
 *  - 따라서 https:\/\/는 문자열 "https://"를 찾는 것을 의미
 * 
 * console\.aws\.amazon\.com\/: 리터럴 문자열 "console.aws.amazon.com/"을 찾는다
 * 
 * .+?: .는 어떤 문자도 매칭(줄바꿈 문자 제외)하며, +는 이전의 문자나 그룹이 하나 또는 그 이상 반복됨을 나타낸다.
 * 
 * ?는 이전의 토큰이 최소한으로 반복되게 만든다. 즉, 가능한 짧은 문자열을 찾는다.
 * 
 * 이 정규식은 "Go to " 뒤에 오는 AWS 콘솔 URL을 찾아낸다.
 */
```
- `"https://console.aws.amazon.com/abc/def"` 문자열과 `https:\/\/console\.aws\.amazon\.com\/.+?` 정규식을 사용하면 매치되는 부분은 `"https://console.aws.amazon.com/abc/"` 이다 . 
- `.+?` 부분은 비탐욕적으로 작동하기 때문에 가능한 한 적은 문자열을 매치하려고 시도
- 그 결과, 첫 번째 /에서 다음 /까지의 문자열만 매치된다
- 따라서 def는 이 정규식 패턴에 의해 매치되지 않는다
- 만약 def까지 포함해서 매치하려면, 정규식의 마지막 부분을 바꾸어야 한다
  - 예를 들면 `https:\/\/console\.aws\.amazon\.com\/.+` 와 같이 사용하면 `def` 까지 매치된다

## Environment Match
```javascript
const envMatch = rawMessage.match(/https:\/\/(\w+?)\./);
/**
 * https:\/\/: 리터럴 문자열 "https://"를 찾는다
 * (\w+?): 단어 문자들을 나타내는 \w와 그 뒤의 +는 하나 이상의 연속된 단어 문자를 나타낸다
 * 여기서 ?는 최소한의 매칭(non-greedy)을 나타내며, 가능한 가장 짧은 연속된 단어 문자들만 캡처
 * 그룹화 ()는 결과에서 해당 부분을 캡처하여 추출하게 해준다
 * \.: 리터럴 문자열로서의 점(.)을 찾는다 
 * 점 자체는 정규식에서 특수 문자로 간주되므로, 리터럴로 처리하기 위해 \로 이스케이프 처리 해야한다
 * 
 */
```
- \ 는 정규식에서 특수한 의미를 갖는 문자를 일반 문자로 해석하게 하는 역할을 한다
- 주어진 rawMessage에서 `"https://"` 다음에 오는 연속된 단어 문자들을 찾아낸다
  - 그리고 그 다음에 오는 첫 번째 점`(.)`까지 매치하며, 단어 문자들을 캡처
  - 결과적으로 `"https://development."` 부분을 매치하고, `"development"`를 캡처

