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
  private static parseLeaf(subject: string, leafText: string): RuleNode {
    // hack to turn the verb interrogative
    const baseVerb = leafText.replace(/s$/, '');
    return {
      andOr: {
        tag: 'Leaf',
        contents: `does the ${subject.toLowerCase()} ${baseVerb}?`
      },
      mark: {
        value: 'undefined',
        source: 'user'
      },
      prePost: {},
      shouldView: 'Ask'
    };
  }
  private static groupConditions(subject: string, conditions: string[], operators: ('AND' | 'OR')[]): RuleNode {
    if (conditions.length === 1) {
      return this.parseLeaf(subject, conditions[0]);
    }
  
    const operator = operators.shift(); 
    if (!operator) {
      throw new Error('invalid rule format');
    }
  
    const splitIndex = Math.floor(conditions.length / 2);
  
    const leftConditions = conditions.slice(0, splitIndex);
    const rightConditions = conditions.slice(splitIndex);
  
    const leftNode = this.groupConditions(subject, leftConditions, operators);
    const rightNode = this.groupConditions(subject, rightConditions, operators);
  
    return {
      andOr: {
        tag: operator === 'AND' ? 'All' : 'Any',
        children: [leftNode, rightNode]
      },
      mark: {
        value: 'undefined',
        source: 'user'
      },
      prePost: {
        Pre: operator === 'AND' ? 'all of:' : 'any of:'
      },
      shouldView: 'View'
    };
  }  

  static parse(rule: string): RuleNode {
    const cleanedRule = rule.replace(/\s+/g, ' ').trim();
    const match = cleanedRule.match(/EVERY\s+(\w+)\s+WHO\s+(.+)\s+MUST\s+(.+)/);

    if (!match) {
      throw new Error('Invalid rule format');
    }

    const subject = match[1];
    const conditions = match[2];

    const conditionParts = conditions.split(/\s+(AND|OR)\s+/);
    const parts: string[] = [];
    const operators: ('AND' | 'OR')[] = [];

    for (let i = 0; i < conditionParts.length; i++) {
      if (conditionParts[i] === 'AND' || conditionParts[i] === 'OR') {
        operators.push(conditionParts[i] as 'AND' | 'OR');
      } else {
        parts.push(conditionParts[i]);
      }
    }

    const groupedConditions = this.groupConditions(subject, parts, operators);

    return {
      andOr: {
        tag: 'All',
        children: groupedConditions.andOr.children
      },
      mark: {
        value: 'undefined',
        source: 'user'
      },
      prePost: {
        Pre: 'all of:'
      },
      shouldView: 'View'
    };
  }
}
