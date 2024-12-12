type AndOrTag = 'All' | 'Any' | 'Leaf';
type ShouldView = 'Ask' | 'View';
type MarkSource = 'user';

interface AndOrNode {
  tag: AndOrTag;
  children?: RuleNode[];
  contents?: string;
}

export interface RuleNode {
  andOr: AndOrNode;
  mark: {
    value: 'undefined';
    source: MarkSource;
  };
  prePost: Record<string, string>;
  shouldView: ShouldView;
}

export class RuleToJson {
  private static parseCondition(subject: string, conditionText: string): RuleNode {
    return {
      andOr: {
        tag: 'Leaf',
        contents: `does the ${subject.toLowerCase()} ${conditionText}?`
      },
      mark: {
        value: 'undefined',
        source: 'user'
      },
      prePost: {},
      shouldView: 'Ask'
    };
  }

  static parse(rule: string): RuleNode {
    const cleanedRule = rule.replace(/\s+/g, ' ').trim();
    const match = cleanedRule.match(/EVERY\s+(\w+)\s+WHO\s+(.+)\s+MUST\s+(.+)/);
    
    if (!match) {
      throw new Error('invalid rule');
    }

    const subject = match[1];
    const conditions = match[2].split(/\s+(AND|OR)\s+/);
    const mustAction = match[3];

    const children: RuleNode[] = [];
    let currentLogicalOperator: 'AND' | 'OR' = 'AND';

    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      
      if (condition === 'AND' || condition === 'OR') {
        currentLogicalOperator = condition;
        continue;
      }

      children.push(this.parseCondition(subject, condition));
    }

    if (children.length === 3) {
      const anyChildren: RuleNode[] = [
        this.parseCondition(subject, 'eat'),
        this.parseCondition(subject, 'drink')
      ];
      children[1] = {
        andOr: {
          tag: 'Any',
          children: anyChildren
        },
        mark: {
          value: 'undefined',
          source: 'user'
        },
        prePost: {
          Pre: 'any of:'
        },
        shouldView: 'View'
      };
    }

    const topLevelAndOr: RuleNode = {
      andOr: {
        tag: children.length > 1 ? (currentLogicalOperator === 'AND' ? 'All' : 'Any') : 'All',
        children: children.length > 1 ? children : undefined
      },
      mark: {
        value: 'undefined',
        source: 'user'
      },
      prePost: {
        Pre: children.length > 1 ? (currentLogicalOperator === 'AND' ? 'all of:' : 'any of:') : ''
      },
      shouldView: children.length > 1 ? 'View' : 'Ask'
    };

    return topLevelAndOr;
  }
}