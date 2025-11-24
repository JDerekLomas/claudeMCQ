"""Seed the database with sample MCQ items."""

import db

SEED_ITEMS = [
    # recursion-base-case (3 items)
    {
        "stem": "What is a base case in recursion?",
        "options": [
            "The first function call made",
            "A condition that stops the recursion",
            "The recursive step that calls itself",
            "Error handling for stack overflow"
        ],
        "correct_answer": "b",
        "explanation": "The base case is a condition that stops the recursion by returning a value without making another recursive call. Without it, the function would recurse infinitely.",
        "objective": "recursion-base-case",
        "difficulty": 0.3,
        "misconceptions": {
            "a": "Confusing the initial invocation with the termination condition",
            "c": "Confusing the base case with the recursive case",
            "d": "Confusing error handling with control flow"
        }
    },
    {
        "stem": "In a recursive factorial function, what is typically the base case?",
        "options": [
            "n * factorial(n-1)",
            "n == 0 or n == 1, return 1",
            "return n",
            "factorial(n) * factorial(n-1)"
        ],
        "correct_answer": "b",
        "explanation": "The factorial of 0 and 1 is 1. This serves as the base case because we know the answer without needing further recursion.",
        "objective": "recursion-base-case",
        "difficulty": 0.4,
        "misconceptions": {
            "a": "This is the recursive case, not the base case",
            "c": "This would return n without computing factorial",
            "d": "This would cause infinite recursion"
        }
    },
    {
        "stem": "What happens if a recursive function has no base case?",
        "options": [
            "It returns None",
            "It runs once and stops",
            "It causes a stack overflow error",
            "It returns 0"
        ],
        "correct_answer": "c",
        "explanation": "Without a base case, the function keeps calling itself indefinitely until the call stack exceeds its limit, causing a stack overflow error.",
        "objective": "recursion-base-case",
        "difficulty": 0.5,
        "misconceptions": {
            "a": "The function doesn't automatically return None",
            "b": "Without a base case, it won't stop after one call",
            "d": "There's no default return of 0"
        }
    },
    # recursion-call-stack (3 items)
    {
        "stem": "What is the call stack in the context of recursion?",
        "options": [
            "A list of all variables in the program",
            "A data structure tracking active function calls",
            "The total memory used by the program",
            "A queue of functions waiting to execute"
        ],
        "correct_answer": "b",
        "explanation": "The call stack is a stack data structure that stores information about active function calls. Each recursive call adds a new frame to the stack.",
        "objective": "recursion-call-stack",
        "difficulty": 0.4,
        "misconceptions": {
            "a": "Variables are stored in stack frames, but the stack itself tracks calls",
            "c": "The call stack is part of memory, but doesn't represent total usage",
            "d": "The call stack is a stack (LIFO), not a queue (FIFO)"
        }
    },
    {
        "stem": "In what order are recursive calls resolved?",
        "options": [
            "First In, First Out (FIFO)",
            "Last In, First Out (LIFO)",
            "Random order",
            "Alphabetical order"
        ],
        "correct_answer": "b",
        "explanation": "Recursive calls are resolved in LIFO order because the call stack is a stack. The most recent call must complete before returning to the previous call.",
        "objective": "recursion-call-stack",
        "difficulty": 0.5,
        "misconceptions": {
            "a": "FIFO describes queues, not the call stack",
            "c": "Call resolution is deterministic, not random",
            "d": "Order is based on call sequence, not naming"
        }
    },
    {
        "stem": "What information is stored in a stack frame during recursion?",
        "options": [
            "Only the function name",
            "Local variables, parameters, and return address",
            "Only the return value",
            "The entire program state"
        ],
        "correct_answer": "b",
        "explanation": "Each stack frame contains the function's local variables, parameters passed to it, and the return address (where to continue after the function returns).",
        "objective": "recursion-call-stack",
        "difficulty": 0.6,
        "misconceptions": {
            "a": "Stack frames contain much more than just the function name",
            "c": "The return value isn't known until the function completes",
            "d": "Only the current function's context is stored, not the entire program"
        }
    },
    # python-lists (2 items)
    {
        "stem": "What does list.append(x) do in Python?",
        "options": [
            "Adds x to the beginning of the list",
            "Adds x to the end of the list",
            "Creates a new list with x",
            "Replaces all elements with x"
        ],
        "correct_answer": "b",
        "explanation": "The append() method adds an element to the end of a list, modifying the list in place.",
        "objective": "python-lists",
        "difficulty": 0.2,
        "misconceptions": {
            "a": "To add to the beginning, use insert(0, x)",
            "c": "append() modifies in place, doesn't create new list",
            "d": "append() adds one element, doesn't replace existing ones"
        }
    },
    {
        "stem": "What is the result of [1, 2, 3] + [4, 5]?",
        "options": [
            "[5, 7, 3]",
            "[1, 2, 3, 4, 5]",
            "[[1, 2, 3], [4, 5]]",
            "Error: cannot add lists"
        ],
        "correct_answer": "b",
        "explanation": "The + operator concatenates lists, creating a new list with all elements from both lists in order.",
        "objective": "python-lists",
        "difficulty": 0.3,
        "misconceptions": {
            "a": "Lists concatenate, they don't perform element-wise addition",
            "c": "Concatenation flattens into one list, doesn't nest",
            "d": "List addition (concatenation) is a valid operation"
        }
    },
    # javascript-promises (2 items)
    {
        "stem": "What does a Promise represent in JavaScript?",
        "options": [
            "A synchronous value that is immediately available",
            "A value that may be available now, later, or never",
            "A function that runs repeatedly",
            "A way to declare variables"
        ],
        "correct_answer": "b",
        "explanation": "A Promise represents an eventual result of an asynchronous operation. It can be pending, fulfilled with a value, or rejected with a reason.",
        "objective": "javascript-promises",
        "difficulty": 0.4,
        "misconceptions": {
            "a": "Promises are specifically for asynchronous operations",
            "c": "That describes setInterval, not Promises",
            "d": "Variables are declared with let, const, or var"
        }
    },
    {
        "stem": "Which method is used to handle a successful Promise resolution?",
        "options": [
            ".catch()",
            ".then()",
            ".finally()",
            ".resolve()"
        ],
        "correct_answer": "b",
        "explanation": "The .then() method is called when a Promise is fulfilled (resolved successfully). It receives the resolved value as its argument.",
        "objective": "javascript-promises",
        "difficulty": 0.3,
        "misconceptions": {
            "a": ".catch() handles rejections (errors), not successes",
            "c": ".finally() runs regardless of outcome, not specifically for success",
            "d": ".resolve() is a static method for creating resolved Promises"
        }
    }
]


def seed_database():
    """Seed the database with sample items."""
    db.init_db()

    for item_data in SEED_ITEMS:
        try:
            item = db.create_item(**item_data)
            print(f"Created item: {item.id} - {item.objective}")
        except Exception as e:
            print(f"Error creating item: {e}")

    print(f"\nSeeded {len(SEED_ITEMS)} items successfully!")


if __name__ == "__main__":
    seed_database()
