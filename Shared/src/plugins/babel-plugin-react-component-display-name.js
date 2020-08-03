module.exports = ({types}) => ({
    visitor: {
        ExpressionStatement(path) {
            const expression = path.node.expression;
            if(expression.type !== 'AssignmentExpression' ||
                expression.left.type !== 'MemberExpression' ||
                expression.left.property.name !== 'propTypes')
                return;

            if(path.parent.type === 'Program') {
                const name = expression.left.object.name;
                const statement = types.expressionStatement(
                    types.assignmentExpression(
                        '=',
                        types.memberExpression(
                            types.identifier(name),
                            types.identifier('displayName')
                        ),
                        types.stringLiteral(name)
                    )
                );
                let index = -1;
                path.parent.body.forEach((expression, i) => {
                    if(index > -1)
                        return;
                    if(expression.type === 'ExpressionStatement' &&
                        expression.expression.type === 'AssignmentExpression' &&
                        expression.expression.left.type === 'MemberExpression' &&
                        expression.expression.left.object.name === name
                    )
                        index = i;
                });
                if(index > -1)
                    path.parent.body.splice(index, 0, statement);
            }
        }
    }
});
