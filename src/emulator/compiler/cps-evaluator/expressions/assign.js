const typer = require('../typer');

const AssignExpression = function(ast, visit) {
	const me = this;
	const buildExpression = function(node) {
		let expression;
		let base;

		switch (node.type) {
			case 'AssignmentStatement':
				expression = {
					left: buildExpression(node.variable),
					right: buildExpression(node.init)
				};
				break;
			default:
				expression = visit(node);
		}

		return expression;
	};

	me.expr = buildExpression(ast);
	me.isExpression = true;

	return me;
};

AssignExpression.prototype.get = async function(operationContext, parentExpr) {
	const me = this;
	const evaluate = async function(node) {
		if (!node.left?.isExpression) {
			console.error(left);
			throw new Error('Unexpected left assignment');
		}

		const left = await node.left.get(operationContext, me.expr);

		if (left.handle) {
			throw new Error('Unexpected left assignment');
		}

		let right = node.right;

		if (typer.isCustomValue(right)) {
			right = right;
		} else if (node.right?.isExpression) {
			right = await right.get(operationContext);
		} else if (node.right?.isOperation) {
			right = await right.get(operationContext);
		} else {
			console.error(right);
			throw new Error('Unexpected right assignment');
		}

		await operationContext.set(left.path, right);

		return true;
	};

	console.log('AssignExpression', 'get', 'expr', me.expr);

	return await evaluate(me.expr);
};

module.exports = AssignExpression;