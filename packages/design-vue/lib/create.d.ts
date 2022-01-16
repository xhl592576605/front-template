import { App } from 'vue';
declare type ComponentType = any;
export interface DVueInstance {
    version: string;
    componentPrefix: string;
    install: (app: App) => void;
}
interface DVueCreateOptions {
    components?: ComponentType[];
    componentPrefix?: string;
}
declare function create({ componentPrefix, components }?: DVueCreateOptions): DVueInstance;
export default create;
