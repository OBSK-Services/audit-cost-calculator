const fse = require("fs-extra");
const parser = require('@solidity-parser/parser');
module.exports = (task) =>
  task(
    "obsk",
    "Returns count of compilation units for the OBSK Security audit based on AST depth.",
  )
    .addOptionalParam('price', "Define how much to charge per CU.", 1.574, types.float)
    .setAction(async ({ price }, hre) => {
      const astNodeTypes = [
        'SourceUnit',
        'PragmaDirective',
        'ImportDirective',
        'ContractDefinition',
        'InheritanceSpecifier',
        'StateVariableDeclaration',
        'UsingForDeclaration',
        'StructDefinition',
        'ModifierDefinition',
        'ModifierInvocation',
        'FunctionDefinition',
        'EventDefinition',
        'CustomErrorDefinition',
        'RevertStatement',
        'EnumValue',
        'EnumDefinition',
        'VariableDeclaration',
        'UserDefinedTypeName',
        'Mapping',
        'ArrayTypeName',
        'FunctionTypeName',
        'Block',
        'ExpressionStatement',
        'IfStatement',
        'WhileStatement',
        'ForStatement',
        'InlineAssemblyStatement',
        'DoWhileStatement',
        'ContinueStatement',
        'Break',
        'Continue',
        'BreakStatement',
        'ReturnStatement',
        'EmitStatement',
        'ThrowStatement',
        'VariableDeclarationStatement',
        'ElementaryTypeName',
        'FunctionCall',
        'AssemblyBlock',
        'AssemblyCall',
        'AssemblyLocalDefinition',
        'AssemblyAssignment',
        'AssemblyStackAssignment',
        'LabelDefinition',
        'AssemblySwitch',
        'AssemblyCase',
        'AssemblyFunctionDefinition',
        'AssemblyFor',
        'AssemblyIf',
        'TupleExpression',
        'NameValueExpression',
        'BooleanLiteral',
        'NumberLiteral',
        'Identifier',
        'BinaryOperation',
        'UnaryOperation',
        'NewExpression',
        'Conditional',
        'StringLiteral',
        'HexLiteral',
        'HexNumber',
        'DecimalNumber',
        'MemberAccess',
        'IndexAccess',
        'IndexRangeAccess',
        'NameValueList',
        'UncheckedStatement',
        'TryStatement',
        'CatchClause',
        'FileLevelConstant',
        'AssemblyMemberAccess',
        'TypeDefinition'
      ];
      let allArtifacts = await hre.run("get_all_artifacts");
      allArtifacts = allArtifacts
        .map(e => e.split(':'))
        .filter(e => e[0].startsWith("contracts"));

      let totalCompilationUnits = 0;
      let costsPerArtifact = {};
      for (const pair of allArtifacts) {
        const source = (await fse.readFile(pair[0])).toString();
        costsPerArtifact[pair[1]] = {
          compilationUnits: 0,
          cost: 0
        };
        try {
          const ast = parser.parse(source);
          const visitor = {};
          astNodeTypes.forEach(e => {
            visitor[e] = () => {
              costsPerArtifact[pair[1]].compilationUnits++;
              costsPerArtifact[pair[1]].cost = costsPerArtifact[pair[1]].compilationUnits * price;
              totalCompilationUnits++;
            };
          });
          parser.visit(ast, visitor);
        } catch (e) {
          if (e instanceof parser.ParserError) {
            console.error(e.errors);
          }
        }
      }
      console.log(costsPerArtifact);
      console.log(totalCompilationUnits, price * totalCompilationUnits);
    });