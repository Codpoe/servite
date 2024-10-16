export var Helmet: {
    new (props: any): {
        shouldComponentUpdate(nextProps: any): boolean;
        mapNestedChildrenToProps(child: any, nestedChildren: any): {
            innerHTML: any;
            cssText?: undefined;
        } | {
            cssText: any;
            innerHTML?: undefined;
        } | null;
        flattenArrayTypeChildren(child: any, arrayTypeChildren: any, newChildProps: any, nestedChildren: any): any;
        mapObjectTypeChildren(child: any, newProps: any, newChildProps: any, nestedChildren: any): any;
        mapArrayTypeChildrenToProps(arrayTypeChildren: any, newProps: any): any;
        warnOnInvalidChildren(child: any, nestedChildren: any): boolean;
        mapChildrenToProps(children: any, newProps: any): any;
        render(): React3.CElement<any, {
            rendered: boolean;
            shouldComponentUpdate(nextProps: any): boolean;
            componentDidUpdate(): void;
            componentWillUnmount(): void;
            emitChange(): void;
            init(): void;
            render(): null;
            context: unknown;
            setState<K extends string | number | symbol>(state: any, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<any>;
            state: Readonly<any>;
            refs: {
                [key: string]: React3.ReactInstance;
            };
            componentDidMount?(): void;
            componentDidCatch?(error: Error, errorInfo: React3.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        }> | React3.DetailedReactHTMLElement<React3.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        context: unknown;
        setState<K extends string | number | symbol>(state: any, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<any>;
        state: Readonly<any>;
        refs: {
            [key: string]: React3.ReactInstance;
        };
        componentDidMount?(): void;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React3.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
        componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
    };
    new (props: any, context: any): {
        shouldComponentUpdate(nextProps: any): boolean;
        mapNestedChildrenToProps(child: any, nestedChildren: any): {
            innerHTML: any;
            cssText?: undefined;
        } | {
            cssText: any;
            innerHTML?: undefined;
        } | null;
        flattenArrayTypeChildren(child: any, arrayTypeChildren: any, newChildProps: any, nestedChildren: any): any;
        mapObjectTypeChildren(child: any, newProps: any, newChildProps: any, nestedChildren: any): any;
        mapArrayTypeChildrenToProps(arrayTypeChildren: any, newProps: any): any;
        warnOnInvalidChildren(child: any, nestedChildren: any): boolean;
        mapChildrenToProps(children: any, newProps: any): any;
        render(): React3.CElement<any, {
            rendered: boolean;
            shouldComponentUpdate(nextProps: any): boolean;
            componentDidUpdate(): void;
            componentWillUnmount(): void;
            emitChange(): void;
            init(): void;
            render(): null;
            context: unknown;
            setState<K extends string | number | symbol>(state: any, callback?: (() => void) | undefined): void;
            forceUpdate(callback?: (() => void) | undefined): void;
            readonly props: Readonly<any>;
            state: Readonly<any>;
            refs: {
                [key: string]: React3.ReactInstance;
            };
            componentDidMount?(): void;
            componentDidCatch?(error: Error, errorInfo: React3.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        }> | React3.DetailedReactHTMLElement<React3.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        context: unknown;
        setState<K extends string | number | symbol>(state: any, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<any>;
        state: Readonly<any>;
        refs: {
            [key: string]: React3.ReactInstance;
        };
        componentDidMount?(): void;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React3.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
        componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
    };
    defaultProps: {
        defer: boolean;
        encodeSpecialCharacters: boolean;
        prioritizeSeoTags: boolean;
    };
    contextType?: React3.Context<any> | undefined;
};
export var HelmetData: {
    new (context: any, canUseDOM: any): {
        instances: any[];
        canUseDOM: boolean;
        context: any;
        value: {
            setHelmet: (serverState: any) => void;
            helmetInstances: {
                get: () => any[];
                add: (instance: any) => void;
                remove: (instance: any) => void;
            };
        };
    };
};
export var HelmetProvider: {
    new (props: any): {
        helmetData: {
            instances: any[];
            canUseDOM: boolean;
            context: any;
            value: {
                setHelmet: (serverState: any) => void;
                helmetInstances: {
                    get: () => any[];
                    add: (instance: any) => void;
                    remove: (instance: any) => void;
                };
            };
        };
        render(): React3.FunctionComponentElement<React3.ProviderProps<{}>>;
        context: unknown;
        setState<K extends string | number | symbol>(state: any, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<any>;
        state: Readonly<any>;
        refs: {
            [key: string]: React3.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React3.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>): any;
        componentDidUpdate?(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<any>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<any>, nextState: Readonly<any>, nextContext: any): void;
    };
    canUseDOM: boolean;
    contextType?: React3.Context<any> | undefined;
};
import React3 from "react";
