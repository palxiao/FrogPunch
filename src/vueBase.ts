import { Vue } from 'vue-property-decorator';

export default class VueBase extends Vue {
    public $utils!: Type.Object
    public $ajax!: Type.Object
    public $bus!: Type.Object
    public $store!: Type.Object
    public $router!: Type.Object
    public $route!: Type.Object
    public $getters!: Type.Object
    public $commit!: (name: string, data: any) => void
    public $dispatch!: (name: string, data: any) => void
    public $Ilist!: (value: any) => any
    public $Imap!: (value: any) => any
    public $copyText!: (value: string) => any
    public $toast!: (params: any) => void
}
