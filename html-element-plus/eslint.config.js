// Configuration file for ESLint
//
// Version: DB-2026-03-28

// spell-checker: ignore nonconstructor isnan nonoctal yoda

import {defineConfig} from 'eslint/config';
import globals from 'globals';

export default defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },

            ecmaVersion: 'latest',
            sourceType: 'module', // or "script"
        },

        linterOptions: {
            noInlineConfig: false,
            reportUnusedDisableDirectives: 'warn',
        },

        rules: {
            // ===== POSSIBLE PROBLEMS =====
            // "These" rules relate to possible logic errors in code.

            // Enforce return statements in callbacks of array methods
            'array-callback-return': 'warn',

            // Require super() calls in constructors
            'constructor-super': 'error',

            // Enforce “for” loop update clause moving the counter in the right direction
            'for-direction': 'warn',

            // Enforce return statements in getters
            'getter-return': 'error',

            // Disallow using an async function as a Promise executor
            'no-async-promise-executor': 'error',

            // Disallow await inside of loops
            'no-await-in-loop': 'warn',

            // Disallow reassigning class members
            'no-class-assign': 'error',

            // Disallow comparing against -0
            'no-compare-neg-zero': 'error',

            // Disallow assignment operators in conditional expressions
            'no-cond-assign': 'error',

            // Disallow reassigning const variables
            'no-const-assign': 'error',

            // Disallow expressions where the operation doesn’t affect the value
            'no-constant-binary-expression': 'warn',

            // Disallow constant expressions in conditions
            'no-constant-condition': 'warn',

            // Disallow returning value from constructor
            'no-constructor-return': 'error',

            // Disallow control characters in regular expressions
            'no-control-regex': 'error',

            // Disallow the use of debugger
            'no-debugger': 'warn',

            // Disallow duplicate arguments in function definitions
            'no-dupe-args': 'error',

            // Disallow duplicate class members
            'no-dupe-class-members': 'error',

            // Disallow duplicate conditions in if-else-if chains
            'no-dupe-else-if': 'error',

            // Disallow duplicate keys in object literals
            'no-dupe-keys': 'error',

            // Disallow duplicate case labels
            'no-duplicate-case': 'error',

            // Disallow duplicate module imports
            'no-duplicate-imports': 'warn',

            // Disallow empty character classes in regular expressions
            'no-empty-character-class': 'error',

            // Disallow empty destructuring patterns
            'no-empty-pattern': 'error',

            // Disallow reassigning exceptions in catch clauses
            'no-ex-assign': 'warn',

            // Disallow fallthrough of case statements
            'no-fallthrough': [
                'warn',
                {
                    commentPattern: '(?:break[\\s\\w]*omitted|fall(?:s|) through)',
                    reportUnusedFallthroughComment: true,
                },
            ],

            // Disallow reassigning function declarations
            'no-func-assign': 'error',

            // Disallow assigning to imported bindings
            'no-import-assign': 'error',

            // Disallow variable or function declarations in nested blocks
            'no-inner-declarations': 'off',

            // Disallow invalid regular expression strings in RegExp constructors
            'no-invalid-regexp': 'warn',

            // Disallow irregular whitespace
            'no-irregular-whitespace': 'warn',

            // Disallow literal numbers that lose precision
            'no-loss-of-precision': 'error',

            // Disallow characters which are made with multiple code points in character class syntax
            'no-misleading-character-class': 'error',

            // Disallow new operators with global non-constructor functions
            'no-new-native-nonconstructor': 'error',

            // Disallow calling global object properties as functions
            'no-obj-calls': 'error',

            // Disallow returning values from Promise executor functions
            'no-promise-executor-return': 'warn',

            // Disallow calling some Object.prototype methods directly on objects
            'no-prototype-builtins': 'error',

            // Disallow assignments where both sides are exactly the same
            'no-self-assign': 'error',

            // Disallow comparisons where both sides are exactly the same
            'no-self-compare': 'warn',

            // Disallow returning values from setters
            'no-setter-return': 'error',

            // Disallow sparse arrays
            'no-sparse-arrays': 'warn',

            // Disallow template literal placeholder syntax in regular strings
            'no-template-curly-in-string': 'warn',

            // Disallow this/super before calling super() in constructors
            'no-this-before-super': 'error',

            // Disallow the use of undeclared variables unless mentioned in /*global  comments
            'no-undef': 'error',

            // Disallow confusing multiline expressions
            'no-unexpected-multiline': 'error',

            // Disallow unmodified loop conditions
            'no-unmodified-loop-condition': 'warn',

            // Disallow unreachable code after return, throw, continue, and break statements
            'no-unreachable': 'error',

            // Disallow loops with a body that allows only one iteration
            'no-unreachable-loop': 'warn',

            // Disallow control flow statements in finally blocks
            'no-unsafe-finally': 'warn',

            // Disallow negating the left operand of relational operators
            'no-unsafe-negation': 'warn',

            // Disallow use of optional chaining in contexts where the undefined value is not allowed
            'no-unsafe-optional-chaining': 'error',

            // Disallow unused private class members
            'no-unused-private-class-members': 'warn',

            // Disallow unused variables
            'no-unused-vars': 'warn',

            // Disallow the use of variables before they are defined
            'no-use-before-define': 'error',

            // Disallow variable assignments when the value is not used
            'no-useless-assignment': 'warn',

            // Disallow useless backreferences in regular expressions
            'no-useless-backreference': 'warn',

            // Disallow assignments that can lead to race conditions due to usage of await or yield
            'require-atomic-updates': 'warn',

            // Require calls to isNaN() when checking for NaN
            'use-isnan': 'error',

            // Enforce comparing typeof expressions against valid strings
            'valid-typeof': 'error',

            // ===== SUGGESTIONS =====
            // "These" rules suggest alternate ways of doing things.

            // Enforce getter and setter pairs in objects and classes
            'accessor-pairs': [
                'error',
                {
                    setWithoutGet: true,
                    getWithoutSet: false,
                },
            ],

            // Require braces around arrow function bodies
            'arrow-body-style': 'off',

            // Enforce the use of variables within the scope they are defined
            'block-scoped-var': 'error',

            // Enforce camelcase naming convention
            camelcase: [
                'warn',
                {
                    properties: 'always',
                    ignoreDestructuring: true,
                    ignoreImports: true,
                    ignoreGlobals: true,
                },
            ],

            // Enforce or disallow capitalization of the first letter of a comment
            'capitalized-comments': 'off',

            // Enforce that class methods utilize this
            'class-methods-use-this': 'off',

            // Enforce a maximum cyclomatic complexity allowed in a program
            complexity: ['warn', 20],

            // Require return statements to either always or never specify values
            'consistent-return': 'off',

            // Enforce consistent naming when capturing the current execution context
            'consistent-this': ['error', 'that'],

            // Enforce consistent brace style for all control statements
            curly: ['warn', 'multi-line', 'consistent'],

            // Require default cases in switch statements
            'default-case': 'off',

            // Enforce default clauses in switch statements to be last
            'default-case-last': 'error',

            // Enforce default parameters to be last
            'default-param-last': 'error',

            // Enforce dot notation whenever possible
            'dot-notation': 'warn',

            // Require the use of === and !==
            eqeqeq: 'off',

            // Require function names to match the name of the variable or property to which they are assigned
            'func-name-matching': 'warn',

            // Require or disallow named function expressions
            'func-names': 'warn',

            // Enforce the consistent use of either function declarations or expressions assigned to variables
            'func-style': 'off',

            // Require grouped accessor pairs in object literals and classes
            'grouped-accessor-pairs': 'off',

            // Require for-in loops to include an if statement
            'guard-for-in': 'error',

            // Disallow specified identifiers
            'id-denylist': 'off',

            // Enforce minimum and maximum identifier lengths
            'id-length': 'off',

            // Require identifiers to match a specified regular expression
            'id-match': 'off',

            // Require or disallow initialization in variable declarations
            'init-declarations': 'off',

            // Require or disallow logical assignment operator shorthand
            'logical-assignment-operators': 'off',

            // Enforce a maximum number of classes per file
            'max-classes-per-file': 'off',

            // Enforce a maximum depth that blocks can be nested
            'max-depth': 'off',

            // Enforce a maximum number of lines per file
            'max-lines': 'off',

            // Enforce a maximum number of lines of code in a function
            'max-lines-per-function': 'off',

            // Enforce a maximum depth that callbacks can be nested
            'max-nested-callbacks': 'off',

            // Enforce a maximum number of parameters in function definitions
            'max-params': 'off',

            // Enforce a maximum number of statements allowed in function blocks
            'max-statements': 'off',

            // Require constructor names to begin with a capital letter
            'new-cap': 'warn',

            // Disallow the use of alert, confirm, and prompt
            'no-alert': 'error',

            // Disallow Array constructors
            'no-array-constructor': 'off',

            // Disallow bitwise operators
            'no-bitwise': 'warn',

            // Disallow the use of arguments.caller or arguments.callee
            'no-caller': 'error',

            // Disallow lexical declarations in case clauses
            'no-case-declarations': 'error',

            // Disallow the use of console
            'no-console': [
                'warn',
                {
                    allow: ['error', 'warn', 'info'],
                },
            ],

            // Disallow continue statements
            'no-continue': 'off',

            // Disallow deleting variables
            'no-delete-var': 'error',

            // Disallow equal signs explicitly at the beginning of regular expressions
            'no-div-regex': 'off',

            // Disallow else blocks after return statements in if statements
            'no-else-return': 'off',

            // Disallow empty block statements
            'no-empty': 'warn',

            // Disallow empty functions
            'no-empty-function': 'warn',

            // Disallow empty static blocks
            'no-empty-static-block': 'warn',

            // Disallow null comparisons without type-checking operators
            'no-eq-null': 'error',

            // Disallow the use of eval()
            'no-eval': 'error',

            // Disallow extending native types
            'no-extend-native': 'off',

            // Disallow unnecessary calls to .bind()
            'no-extra-bind': 'warn',

            // Disallow unnecessary boolean casts
            'no-extra-boolean-cast': 'off',

            // Disallow unnecessary labels
            'no-extra-label': 'warn',

            // Disallow assignments to native objects or read-only global variables
            'no-global-assign': 'error',

            // Disallow shorthand type conversions
            'no-implicit-coercion': 'off',

            // Disallow declarations in the global scope
            'no-implicit-globals': 'error',

            // Disallow the use of eval()-like methods
            'no-implied-eval': 'error',

            // Disallow inline comments after code
            'no-inline-comments': 'off',

            // Disallow use of this in contexts where the value of this is undefined
            'no-invalid-this': 'error',

            // Disallow the use of the __iterator__ property
            'no-iterator': 'error',

            // Disallow labels that share a name with a variable
            'no-label-var': 'off',

            // Disallow labeled statements
            'no-labels': 'off',

            // Disallow unnecessary nested blocks
            'no-lone-blocks': 'off',

            // Disallow if statements as the only statement in else blocks
            'no-lonely-if': 'warn',

            // Disallow function declarations that contain unsafe references inside loop statements
            'no-loop-func': 'warn',

            // Disallow magic numbers
            'no-magic-numbers': 'off',

            // Disallow use of chained assignment expressions
            'no-multi-assign': 'off',

            // Disallow multiline strings
            'no-multi-str': 'off',

            // Disallow negated conditions
            'no-negated-condition': 'off',

            // Disallow nested ternary expressions
            'no-nested-ternary': 'warn',

            // Disallow new operators outside of assignments or comparisons
            'no-new': 'off',

            // Disallow new operators with the Function object
            'no-new-func': 'error',

            // Disallow new operators with the String, Number, and Boolean objects
            'no-new-wrappers': 'off',

            // Disallow &#92;8 and &#92;9 escape sequences in string literals
            'no-nonoctal-decimal-escape': 'error',

            // Disallow calls to the Object constructor without an argument
            'no-object-constructor': 'off',

            // Disallow octal literals
            'no-octal': 'error',

            // Disallow octal escape sequences in string literals
            'no-octal-escape': 'off',

            // Disallow reassigning function parameters
            'no-param-reassign': 'off',

            // Disallow the unary operators ++ and --
            'no-plusplus': 'off',

            // Disallow the use of the __proto__ property
            'no-proto': 'error',

            // Disallow variable redeclaration
            'no-redeclare': 'error',

            // Disallow multiple spaces in regular expressions
            'no-regex-spaces': 'warn',

            // Disallow specified names in exports
            'no-restricted-exports': 'off',

            // Disallow specified global variables
            'no-restricted-globals': 'off',

            // Disallow specified modules when loaded by import
            'no-restricted-imports': 'off',

            // Disallow certain properties on certain objects
            'no-restricted-properties': 'off',

            // Disallow specified syntax
            'no-restricted-syntax': 'off',

            // Disallow assignment operators in return statements
            'no-return-assign': 'warn',

            // Disallow javascript: urls
            'no-script-url': 'error',

            // Disallow comma operators
            'no-sequences': 'off',

            // Disallow variable declarations from shadowing variables declared in the outer scope
            'no-shadow': 'warn',

            // Disallow identifiers from shadowing restricted names
            'no-shadow-restricted-names': 'off',

            // Disallow ternary operators
            'no-ternary': 'off',

            // Disallow throwing literals as exceptions
            'no-throw-literal': 'error',

            // Disallow initializing variables to undefined
            'no-undef-init': 'off',

            // Disallow the use of undefined as an identifier
            'no-undefined': 'error',

            // Disallow dangling underscores in identifiers
            'no-underscore-dangle': 'off',

            // Disallow ternary operators when simpler alternatives exist
            'no-unneeded-ternary': 'off',

            // Disallow unused expressions
            'no-unused-expressions': 'off',

            // Disallow unused labels
            'no-unused-labels': 'warn',

            // Disallow unnecessary calls to .call() and .apply()
            'no-useless-call': 'off',

            // Disallow unnecessary catch clauses
            'no-useless-catch': 'warn',

            // Disallow unnecessary computed property keys in objects and classes
            'no-useless-computed-key': 'off',

            // Disallow unnecessary concatenation of literals or template literals
            'no-useless-concat': 'warn',

            // Disallow unnecessary constructors
            'no-useless-constructor': 'warn',

            // Disallow unnecessary escape characters
            'no-useless-escape': 'off',

            // Disallow renaming import, export, and destructured assignments to the same name
            'no-useless-rename': 'warn',

            // Disallow redundant return statements
            'no-useless-return': 'off',

            // Require let or const instead of var
            'no-var': 'error',

            // Disallow void operators
            'no-void': 'off',

            // Disallow specified warning terms in comments
            'no-warning-comments': 'off',

            // Disallow with statements
            'no-with': 'error',

            // Require or disallow method and property shorthand syntax for object literals
            'object-shorthand': 'off',

            // Enforce variables to be declared either together or separately in functions
            'one-var': 'off',

            // Require or disallow assignment operator shorthand where possible
            'operator-assignment': 'off',

            // Require using arrow functions for callbacks
            'prefer-arrow-callback': 'off',

            // Require const declarations for variables that are never reassigned after declared
            'prefer-const': 'off',

            // Require destructuring from arrays and/or objects
            'prefer-destructuring': 'off',

            // Disallow the use of Math.pow in favor of the ** operator
            'prefer-exponentiation-operator': 'off',

            // Enforce using named capture group in regular expression
            'prefer-named-capture-group': 'off',

            // Disallow parseInt() and Number.parseInt() in favor of binary, octal, and hexadecimal literals
            'prefer-numeric-literals': 'off',

            // Disallow use of Object.prototype.hasOwnProperty.call() and prefer use of Object.hasOwn()
            'prefer-object-has-own': 'off',

            // Disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead
            'prefer-object-spread': 'off',

            // Require using Error objects as Promise rejection reasons
            'prefer-promise-reject-errors': 'off',

            // Disallow use of the RegExp constructor in favor of regular expression literals
            'prefer-regex-literals': 'off',

            // Require rest parameters instead of arguments
            'prefer-rest-params': 'off',

            // Require spread operators instead of .apply()
            'prefer-spread': 'off',

            // Require template literals instead of string concatenation
            'prefer-template': 'off',

            // Enforce the consistent use of the radix argument when using parseInt()
            radix: 'off',

            // Disallow async functions which have no await expression
            'require-await': 'warn',

            // Enforce the use of u or v flag on RegExp
            'require-unicode-regexp': 'warn',

            // Require generator functions to contain yield
            'require-yield': 'warn',

            // Enforce sorted import declarations within modules
            'sort-imports': 'off',

            // Require object keys to be sorted
            'sort-keys': 'off',

            // Require variables within the same declaration block to be sorted
            'sort-vars': 'off',

            // Require or disallow strict mode directives
            strict: 'off',

            // Require symbol descriptions
            'symbol-description': 'off',

            // Require var declarations be placed at the top of their containing scope
            'vars-on-top': 'off',

            // Require or disallow “Yoda” conditions
            yoda: 'warn',

            // ===== LAYOUT & FORMATTING =====
            // "These" rules care about how the code looks rather than how it executes.

            // Require semicolons instead of ASI.
            semi: 'error',

            // Require or disallow Unicode byte order mark (BOM)
            'unicode-bom': ['error', 'never'],
        },
    },
]);
