let resultOperations = [];

function humanReadableExprFromArray(expr, start, end) {
    let real = '';
    for (let i = start; i < end; i++) {
        real += ' ' + expr[i] + ' ';
    }
    return real;
}

function isOperator(str) {
    switch (str) {
        case '+':
            return true;
        case '-':
            return true;
        case '*':
            return true;
    }
    return false;
}

function operatorPriority(str) {
    switch (str) {
        case '+':
            return 3;
        case '-':
            return 2;
        case '*':
            return 1;
    }
    return false;
}

function evalOperand(operand, p1, p2, pos) {
    switch (operand) {
        case '+':
            return p1 + p2;
        case '-':
            return p1 - p2;
        case '*':
            return p1 * p2;
    }
    throw new Error(`EvalOperandError: unknown operand ${operand} at ${pos}`);
}

function evalUnary(operand, p) {
    switch (operand) {
        case '+':
            return p;
        case '-':
            return -p;
    }
    throw new Error(`EvalOperandError: unknown unary operand ${operand} at ${pos}`);
}

function myeval(e, start, end) {

    //debug
    console.log('eval ', start, end, ':::', humanReadableExprFromArray(e, start, end));

    if ((end - start) < 1) {
        return 0;
    }

    // if it is a single value return it
    if ((end - start) <= 1) {
        resultOperations.push(e[start]);
        return e[start];
    }

    if (isOperator(e[start]) && (end - start) == 2) {
        resultOperations.push(e[start] + '!');
        return evalUnary(e[start], myeval(e, start + 1, end));
    }

    // if the whole expression is in brackets remove them
    if (e[start] === '(' && e[end - 1] === ')') {
        let open = false;
        let opened = 0;
        for (let i = start + 1; i < end - 1; i++) {
            if (e[i] === '(') {
                opened++;
            }
            if (e[i] === ')') {
                opened--;
            }
            if (opened < 0) {
                open = true;
                break;
            }
        }

        if (open === false) {
            return myeval(e, start + 1, end - 1);
        }
    }

    // find the most priority operator outside of brackets
    let maxOperatorPosition = -1;
    let maxOperatorPriority = -1;

    let openedBrackets = 0;

    for (let i = start; i < end; i++) {
        if (e[i] === '(') {
            if (maxOperatorPosition >= 0) {
                break;
            }
            openedBrackets++;
        }

        if (e[i] === ')') {
            openedBrackets--;
        }

        if (openedBrackets > 0) {
            continue;
        }

        let type = typeof e[i];
        if (type === 'string') {
            if (isOperator(e[i])) {

                if (i > start && isOperator(e[i - 1])) {
                    continue;
                }

                let priority = operatorPriority(e[i]);
                if (priority >= maxOperatorPriority) {
                    maxOperatorPosition = i;
                    maxOperatorPriority = priority;
                }
            }
        }
    }

    //console.log('op:', e[maxOperatorPosition], maxOperatorPosition);
    resultOperations.push(e[maxOperatorPosition]);


    return evalOperand(e[maxOperatorPosition], myeval(e, start, maxOperatorPosition), myeval(e, maxOperatorPosition + 1, end), maxOperatorPosition);
}

try {
    let expr = [2,'+', 1];

    console.log('expression:', humanReadableExprFromArray(expr, 0, expr.length));
    console.log('real true value:', eval(humanReadableExprFromArray(expr, 0, expr.length)));
    console.log('evaluated: ', myeval(expr, 0, expr.length));
    console.log('--- operations to solve the expression:');

    let str = '';
    for (let i = 0; i < resultOperations.length; i++) {
        str += resultOperations[i] + ' ';
    }
    console.log(str);
} catch (err) {
    console.log('ERROR', err.message);
    console.log('-----------');
    console.log('operations:');
    console.log(resultOperations);
}
