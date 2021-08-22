const far = 2017
const now = new Date()
const nowYear = now.getFullYear()
const count = nowYear - far
const arr = []
let a = 0;
while (a <= count) {
    arr.push(far + a)
    a++
}
export default { arr }
