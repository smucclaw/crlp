export const fakeJson = {
    andOr: {
        tag: 'All',
        children: [
            {
                andOr: {
                    tag: 'Leaf',
                    contents: 'does the person walk?',
                },
                mark: {
                    value: 'undefined',
                    source: 'user',
                },
                prePost: {},
                shouldView: 'Ask',
            },
            {
                andOr: {
                    tag: 'Any',
                    children: [
                        {
                            andOr: {
                                tag: 'Leaf',
                                contents: 'does the person eat?',
                            },
                            mark: {
                                value: 'undefined',
                                source: 'user',
                            },
                            prePost: {},
                            shouldView: 'Ask',
                        },
                        {
                            andOr: {
                                tag: 'Leaf',
                                contents: 'does the person drink?',
                            },
                            mark: {
                                value: 'undefined',
                                source: 'user',
                            },
                            prePost: {},
                            shouldView: 'Ask',
                        },
                    ],
                },
                mark: {
                    value: 'undefined',
                    source: 'user',
                },
                prePost: {
                    Pre: 'any of:',
                },
                shouldView: 'View',
            },
        ],
    },
    mark: {
        value: 'undefined',
        source: 'user',
    },
    prePost: {
        Pre: 'all of:',
    },
    shouldView: 'View',
};
