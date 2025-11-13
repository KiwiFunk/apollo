---
title: "Base Systems And Data Representation"
description: "What are Base Systems, and how do we store Data in Ones and Zeros?"
publishDate: "2025-11-06"
category: "CompSci Basics"
---
## Base Systems Overview
Base systems (also known as number systems) are methods for representing and working with numbers using different sets of digits. The most common base systems include:

- Binary (Base 2): Uses only two digits: 0 and 1.

- Decimal (Base 10): Uses ten digits: 0 through 9. This is the standard number system we use in everyday life.

- Hexadecimal (Base 16): Uses sixteen digits, where the digits 0-9 are followed by the letters a-f (representing the values 10-15).

Each base system has its own way of representing and interpreting numbers, but they all work on the same basic principle: **place value**.

### Place Value System
In any base system, the value of a number is determined by the digits' positions in the sequence, with each position representing a power of the base. The smallest number is always represented in the far-right position, and each position represents increasing powers of the base.

For example, in **binary (base 2)**:
- The far-right digit represents (2^0 = 1)
- The next digit to the left represents (2^1 = 2)
- Then (2^2 = 4), and so on

In **decimal (base 10)**:
- The far-right digit represents (10^0 = 1)
- The next digit to the left represents (10^1 = 10)
- Then (10^2 = 100), and so on

In **hexadecimal (base 16)**:
- The far-right digit represents (16^0 = 1)
- The next digit represents (16^1 = 16)
- Then (16^2 = 256), and so on.

### Max Value vs. Max Signed Value
In base systems, there are different ways of interpreting numbers. The **max value** refers to the largest possible number that can be represented by a given number of digits. The **max signed value**, on the other hand, includes both positive and negative numbers, typically using a method called **two's complement** in binary systems.

For example, in a 4-bit binary system:
- The **max value** for an unsigned number is 1111, which is (2^4 - 1 = 15)
- The **max signed value** (if we use two's complement) is 0111, which is 7. This allows us to represent both positive and negative values, ranging from -8 to +7.

#### Key Points
- The **smallest value** in a number system is always on the far-right side of the sequence.
- **Base systems** represent values using positions that correspond to powers of the base.
- In binary, values increase by powers of 2; in decimal, by powers of 10; and in hexadecimal, by powers of 16.
- The largest possible value and the range of signed values depend on how many digits (bits or other units) are available to represent the number.

## Binary Storage and Data Representation

Now that we understand base systems and place value, let’s see how these concepts apply to storing data in computers. Computers use **binary (base 2)** internally, meaning all data, such as numbers, text and images is ultimately represented as sequences of `0`s and `1`s.

### Bytes and Bits

*   A **bit** is the smallest unit of data and can hold a value of `0` or `1`.
*   A **byte** consists of **8 bits**, allowing for ( 2^8 = 256 ) possible values (0–255).

Each bit in a byte represents a power of 2:

| Position | 128 | 64 | 32 | 16 |  8 |  4 |  2 |  1 |
| -------- | --: | -: | -: | -: | -: | -: | -: | -: |
| Power    |  2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ |

For example:

| Target Value | 128 | 64 | 32 | 16 |  8 |  4 |  2 |  1 |
| -----------: | --: | -: | -: | -: | -: | -: | -: | -: |
|      **171** |   1 |  0 |  1 |  0 |  1 |  0 |  1 |  1 |
|      **116** |   0 |  1 |  1 |  1 |  0 |  1 |  0 |  0 |

This means:

*   **171** in decimal = `10101011` in binary
*   **116** in decimal = `01110100` in binary

### Text Representation: ASCII

Text characters are stored as numeric codes. The most common early standard is **ASCII**, which uses one byte per character (values 0–127 for standard characters). Using the lookup table for ASCII, we can calculate the following:

Example: `"hello world"` in ASCII:

| Character | ASCII Decimal | Binary (8 bits) |
| --------- | ------------: | --------------- |
| h         |           104 | 01101000        |
| e         |           101 | 01100101        |
| l         |           108 | 01101100        |
| l         |           108 | 01101100        |
| o         |           111 | 01101111        |
| (space)   |            32 | 00100000        |
| w         |           119 | 01110111        |
| o         |           111 | 01101111        |
| r         |           114 | 01110010        |
| l         |           108 | 01101100        |
| d         |           100 | 01100100        |



### Unicode and Multi-Byte Encoding

ASCII works for English letters and symbols, but what about emojis or non-Latin scripts? Enter **Unicode**, which assigns a unique code point to every character in every language.

*   **UTF-8**: Variable-length encoding (1–4 bytes per character). Backward compatible with ASCII.
*   **UTF-16**: Uses 2 or 4 bytes per character.
*   Example: The emoji 😀 has Unicode code point U+1F600 and requires **4 bytes** in UTF-8.


#### Key Takeaways:

*   Binary is the foundation of all data storage.
*   A byte (8 bits) can represent 256 values.
*   ASCII uses one byte per character; Unicode uses multiple bytes for global language support.
*   Place value in binary works exactly like decimal—just with base 2.