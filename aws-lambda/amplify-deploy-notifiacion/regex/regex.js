const str = "The price is 120 dollars."
const regex = /\d+/g
const result = str.match(regex)
console.log('result',result) // ['120']

/**
 * 전역플래그 g 가 있는 경우 match 메서드는 일치하는 모든 문자열의 배열을 만든다
 * 이 배열에는 추가적인 속성 ( 'index', 'input', 'groups' 등 ) 이 포함되어 있지 않다
 * 1. index: 해당 일치 항목이 시작되는 문자열 내의 위치입니다.
 * 2. input: 원본 문자열입니다. 이것은 match 메서드가 호출된 문자열과 같습니다.
 * 3. groups: 명명된 캡처 그룹이 있는 정규식의 경우, 이 속성은 해당 그룹의 일치 항목을 포함하는 객체입니다. 만약 정규식에 명명된 캡처 그룹이 없으면, 이 속성의 값은 undefined가 됩니다.
 * 추가적인 속성이 포함되어 있다면?
 * result [
 *   '120',
 *   index: 13,
 *   input: 'The price is 120 dollars.',
 *   groups: undefined
 * ]
 */