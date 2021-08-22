export default class PreLoad {
    private i: number;
    private arr: string[];
    constructor(arr: string[]) {
        this.i = 0
        this.arr = arr
    }
    public imgs() {
        return new Promise(resolve => {
            const work = (src: string) => {
                if (this.i < this.arr.length) {
                    const img = new Image()
                    img.src = src;
                    if (img.complete) {
                        work(this.arr[this.i++])
                    } else {
                        img.onload = () => {
                            work(this.arr[this.i++])
                            img.onload = null;
                        };
                    }
                    // console.log(((this.i + 1) / this.arr.length) * 100);
                } else {
                    resolve()
                }
            }
            work(this.arr[this.i])
        })
    }
}
