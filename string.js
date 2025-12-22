// 1️⃣ Reverse a String (Manual Method Only)
// Input: "javascript"
// Output: "tpircsavaj" ✨ Use a loop — no .reverse().

// const n = "javascript"
// let str = ""

// way 1
// for (let i = n.length - 1; i >= 0; i--) {
//     str += n[i]
// }

// way 2
// let reverse = ""
// for (let ch of n) {
//     str = ch + str
// }

// console.log(str)


// 2️⃣ Check if a String is a Palindrome
// Input: "racecar"
// Output: Palindrome ✨ Compare characters from both ends using two-pointer logic.

// function Palindrome(n) {
//     let left = 0
//     let right = n.length - 1

//     while (left < right) {
//         if (n[left] !== n[right]) { return false }
//         else {
//             right--;
//             left++;
//         }
//     }
//     return true
// }

// console.log(Palindrome("hell"))
// console.log(Palindrome("racecar"))



//3️⃣ Count Frequency of Each Character
// Input: "banana"
// Output: { b:1, a:3, n:2 } ✨ Teaches hash maps / JS objects + iteration.

// By using map
// function freq(str) {
//     const map = new Map()

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }

//     return map
// }

// By using object
// function freq(str) {
//     const obj = {}
//     for (let ch of str) {
//         obj[ch] = (obj[ch] || 0) + 1
//     }

//     return obj
// }
// console.log(freq("banana"))


// 4️⃣ Find the Most Frequent Character in a String
// Input: "success"
// Output: Most frequent: s (3 times) ✨ Builds on frequency map — find maximum occurrence.

// function freq(str) {
//     const map = new Map()

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }

//     let char = ""
//     let maxFreq = 0
//     for (let [key, val] of map) {

//         // without char
//         // maxFreq = Math.max(maxFreq, val)

//         // with char
//         if (maxFreq < val) {
//             maxFreq = val
//             char = key
//         }
//     }

//     return { char, maxFreq }
// }

// console.log(freq("success"))


// 5️⃣ Check if Two Strings Are Anagrams (Without Sorting)
// Input: "listen", "silent"
// Output: Anagram ✨ Use character frequency comparison — no .sort().

// function anagram(str, str1) {
//     const map = new Map()

//     if (str.length !== str1.length) return false

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }

//     for (let ch of str1) {

//         if (!map.has(ch)) {
//             return false
//         }

//         map.set(ch, (map.get(ch)) - 1)

//         if (map.get(ch) == 0) {
//             map.delete(ch)
//         }
//     }

//     if (map.size === 0) return true
//     return false
// }

// console.log(anagram("listen", "silent"))


// 6️⃣ Find the First Non-Repeating Character
// Input: "aabbcddeff"
// Output: c ✨ Requires 2-pass algorithm: first count → then find first unique.

// function firstNonRepeatingChar(str) {
//     const map = new Map()

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }

//     for (let [key, val] of map) {
//         if (val === 1) {
//             return key
//         }
//     }

//     return false
// }

// console.log(firstNonRepeatingChar("aabbcddeff"))


// 7️⃣ Remove All Duplicate Characters (Keep First Occurrence)
// Input: "programming"
// Output: "progamin" ✨ Use a visited set + build new string.


// WITH TWO LOOPS
// function keepFirstOccurrence(str) {
//     const map = new Map()

//     for (let ch of str) {
//         if (!map.has(ch)) {
//             map.set(ch, true)
//         }
//     }

//     let result = ""
//     for (let [key, val] of map) {
//         result += key
//     }

//     return result
// }

// console.log(keepFirstOccurrence("programming"))

// WITH ONE LOOPS
// function keepFirstOccurrence(str) {
//     let result = ""
//     const map = new Map()

//     for (let ch of str) {
//         if (!map.has(ch)) {
//             map.set(ch, true)
//             result += ch
//         }
//     }
//     return result
// }

// console.log(keepFirstOccurrence("programming"))

// USING INBUILT
// function keepFirstOccurrence(str) {
//     return [...new Set(str)].join("")
// }

// console.log(keepFirstOccurrence("programming"))


// 8️⃣ Check if a String Contains Only Alphabets (No Regex)
// Input: "HelloWorld123"
// Output: False ✨ Use ASCII ranges manually.

// function stringOnly(str) {
//     for (let ch of str) {
//         const char = ch.charCodeAt()
//         console.log(char)
//         // if (!((char >= 65 && char <= 90) || (char >= 97 && char <= 122))) {
//         //     return false
//         // }

//         if (
//             !((ch >= 'A' && ch <= 'Z') ||
//                 (ch >= 'a' && ch <= 'z'))
//         ) {
//             return false;
//         }
//     }
//     return true
// }

// console.log(stringOnly("HelloWorld"))


// 9️⃣ Reverse Only the Words in a Sentence
// Input: "I love coding"
// Output: "coding love I" ✨ Split manually or build reverser yourself.

//  TWO LOOPS
// function reverseSentence(str) {
//     let result = []
//     let str1 = ""

//     for (let ch of str) {
//         if (ch !== " ") {
//             str1 += ch
//         }
//         else {
//             result.push(str1)
//             str1 = ""
//         }
//     }

//     if (str1.length) {
//         result.push(str1)
//     }

//     let words = ""
//     for (let i = result.length - 1; i >= 0; i--) {
//         words += result[i]

//         if (i !== 0) words += " "
//     }

//     return words

// }


//  SINGLE LOOPS
// function reverseSentence(str) {
//     let result = ""
//     let str1 = ""

//     for (let ch = str.length - 1; ch >= 0; ch--) {
//         if (str[ch] !== " ") {
//             str1 = str[ch] + str1
//         }
//         else {
//             result += str1 + " "
//             str1 = ""
//         }
//     }

//     result += str1


//     return result

// }


// console.log(reverseSentence("I love coding"))


// 🔟 Reverse Only the Words in a Sentence at same place
// Input: "I love coding"
// Output: "I evol gnidoc"
// function reverseSentence(str) {
//     let result = ""
//     let str1 = ""

//     for (let ch of str) {
//         if (ch !== " ") {
//             str1 = ch + str1
//         }
//         else {
//             result += str1 + " "
//             str1 = ""
//         }
//     }

//     result += str1

//     return result

// }


// console.log(reverseSentence("I love coding"))


// 1️⃣1️⃣ Find the Longest Word in a Sentence
// Input: "coding is beautiful"
// Output: "beautiful" ✨ Manual scanning + longest tracking.

// WAY 1
// function longestWord(str) {
//     const map = new Map()
//     let str1 = ""
//     for (let ch of str) {
//         if (ch !== " ") { str1 += ch }
//         else {
//             map.set(str1, str1.length)
//             str1 = ""
//         }
//     }
//     map.set(str1, str1.length)

//     let maxLength = 0
//     let word = ""
//     for (let [key, val] of map) {
//         if (maxLength < val) {
//             maxLength = val
//             word = key
//         }
//     }
//     return { word, maxLength }
// }

// function longestWord(str) {
//     let str1 = ""
//     let maxLength = 0;
//     let word = ""
//     for (let ch of str) {
//         if (ch !== " ") { str1 += ch }
//         else {
//             if (maxLength < str1.length) {
//                 maxLength = str1.length;
//                 word = str1
//             }
//             str1 = ""
//         }
//     }

//     if (str1.length > maxLength) {
//         maxLength = str1.length;
//         word = str1;
//     }
//     return { word, maxLength }
// }

// console.log(longestWord("coding is beautiful"))


// 1️⃣2️⃣ Count the Number of Words (Manually Without split)
// Input: "  hi   there  world "
// Output: 3 words ✨ Detect transitions from space → non-space using logic.


// function noOfWords(str) {
//     let str1 = ""
//     let count = 0
//     for (let ch of str) {
//         if (ch !== " ") {
//             str1 += ch
//         }
//         else if (str1 !== "") {
//             count++
//             str1 = ""
//         }

//     }
//     if (str1 !== "") {
//         count++
//     }

//     return count
// }

// console.log(noOfWords("  hi hi   there  world "))


// 1️⃣3️⃣ Find All Substrings of a String (No Built-ins)
// Input: "abc"
// Output: a, ab, abc, b, bc, c ✨ Nested loops + substring construction.

// function substrings(str) {
//     const res = []
//     for (let i = 0; i < str.length; i++) {
//         let str1 = ""
//         for (let j = i; j < str.length; j++) {
//             str1 += str[j]
//             // res.push(str.substring(i, j)); // with inbuilt
//             res.push(str1)
//         }
//     }
//     return res
// }

// console.log(substrings("abc"))

// 1️⃣4️⃣ Compress a String (Basic Run-Length Encoding)
// Input: "aaabbccccd"
// Output: "a3b2c4d1" ✨ Count consecutive characters and build encoded output.

// TWO LOOPS
// function stringCompression(str) {
//     const map = new Map()

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }
//     let result = ""


//     for (let [key, val] of map) {
//         result += `${key}${val}`
//     }

//     return result
// }

// SINGLE LOOPS
// function stringCompression(str) {
//     let res = ""
//     let count = 1
//     for (let ch = 0; ch < str.length; ch++) {
//         if (str[ch] === str[ch + 1]) {
//             count++
//         }
//         else {
//             res += str[ch] + count;
//             count = 1
//         }
//     }

//     return res
// }

// console.log(stringCompression("aaabbccccd"))