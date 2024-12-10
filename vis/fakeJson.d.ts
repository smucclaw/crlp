export declare const fakeJson: {
    andOr: {
        tag: string;
        children: ({
            andOr: {
                tag: string;
                contents: string;
                children?: undefined;
            };
            mark: {
                value: string;
                source: string;
            };
            prePost: {
                Pre?: undefined;
            };
            shouldView: string;
        } | {
            andOr: {
                tag: string;
                children: {
                    andOr: {
                        tag: string;
                        contents: string;
                    };
                    mark: {
                        value: string;
                        source: string;
                    };
                    prePost: {};
                    shouldView: string;
                }[];
                contents?: undefined;
            };
            mark: {
                value: string;
                source: string;
            };
            prePost: {
                Pre: string;
            };
            shouldView: string;
        })[];
    };
    mark: {
        value: string;
        source: string;
    };
    prePost: {
        Pre: string;
    };
    shouldView: string;
};
