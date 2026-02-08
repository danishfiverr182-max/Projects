// Level 1: Warm-up Tasks

console.log("Level 1: Warm-up Tasks");

// Map: Multiply each number by 3
const numbers = [1, 2, 3, 4, 5];
let multipliedBy3 = numbers.map((item) => {
    return item * 3;
});
console.log("Task 1: Multiply by 3:", multipliedBy3);


// filter: Numbers greater than 10
const numbersList = [12, 5, 8, 130, 44];
let greaterThan10 = numbersList.filter((item) => {
    return item > 10;
});
console.log("Task 2: Greater than 10:", greaterThan10);


// forEach: Print each fruit
const fruits = ["apple", "banana", "mango"];
console.log("Task 3: Fruits:");
fruits.forEach((item) => {
    console.log(`Fruit: ${item}`);
});


// Level 2: Real-World Style Tasks
console.log("Level 2: Real-World Style Tasks");


// Map: Extract only names
const users = [
    { name: "Ali", age: 22 },
    { name: "Sara", age: 18 },
    { name: "Ahmed", age: 25 }
];

let userNames = users.map((item) => {
    return item.name;
});
console.log("Task 4: User Names:", userNames);


// filter: Users 18 or older
let adults = users.filter((item) => {
    return item.age >= 18;
});
console.log("Task 5: Adults (18+):", adults);


// find: Find product with id === 2
const products = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" },
    { id: 3, name: "Tablet" }
];

let foundProduct = products.find((item) => {
    return item.id === 2;
});
console.log("Task 6: Found Product:", foundProduct);


// Level 3: Logic-Thinking Tasks

console.log("Level 3: Logic-Thinking Tasks");

// every: Check if all scores are above 50
const scores = [70, 85, 90, 60];
let allAbove50 = scores.every((item) => {
    return item > 50;
});
console.log("Task 7: All scores above 50?:", allAbove50);


// some: Check if at least one email is Gmail
const emails = ["test@gmail.com", "hello@yahoo.com", "admin@gmail.com"];
let hasGmail = emails.some((item) => {
    return item.includes("@gmail.com");
});
console.log("Task 8: Has Gmail account?:", hasGmail);


// Combined Methods Challenge
console.log("Combined Methods Challenge");

const students = [
    { name: "Ali", marks: 80 },
    { name: "Sara", marks: 45 },
    { name: "Ahmed", marks: 90 },
    { name: "Zara", marks: 60 }
];

// Step 1: Filter students with marks >= 60 (passing students)
let passingStudents = students.filter((item) => {
    return item.marks >= 60;
});
console.log("Task 9: Passing Students (marks >= 60):", passingStudents);

// Step 2: Get only the names of passing students
let passingStudentNames = passingStudents.map((item) => {
    return item.name;
});
console.log("Task 9: Passing Student Names:", passingStudentNames);

// Or we can do it in one line (method chaining)
let passingNames = students
    .filter((item) => item.marks >= 60)
    .map((item) => item.name);
console.log("Task 9: Passing Names (chained):", passingNames);

// Bonus: Additional Combined Method Examples

console.log("Bonus: Additional Combined Method Examples");

// Get total marks of all passing students
let totalMarksOfPassing = students
    .filter((item) => item.marks >= 60)
    .reduce((acc, item) => acc + item.marks, 0);
console.log("Bonus: Total marks of passing students:", totalMarksOfPassing);

// Check if any student scored above 85
let anyoneAbove85 = students.some((item) => item.marks > 85);
console.log("Bonus: Anyone scored above 85?:", anyoneAbove85);