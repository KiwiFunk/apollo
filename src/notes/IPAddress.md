---
title: "IPv4 and IPv6"
description: "What is an IP address, and why do we use it?"
publishDate: "2025-11-08"
category: "Networking Basics"
---
## 1. What is an IP Address?

An **IP (Internet Protocol) address** is a unique series of bits used to identify a device on a network.
It’s like a digital address — allowing data to find the right destination across the Internet.

There are two main versions in use:

* **IPv4 (Internet Protocol version 4)** – uses a **32-bit** integer value.
* **IPv6 (Internet Protocol version 6)** – uses a **128-bit** value.

---

## 2. IPv4 — Structure and Basics

IPv4 addresses are made up of **4 blocks of 8 bits** (4 bytes total).
Each block is called an *octet*.

Example:

```
192.168.1.10
```

Each octet can be between **0 and 255** (since 8 bits can represent 256 possible values).

In binary:

```
11000000.10101000.00000001.00001010 → 192.168.1.10
```

---

## 3. Network and Host Portions

Every IP address has two parts:

* **Network portion:** Identifies the network.
* **Host portion:** Identifies the specific device (host) on that network.

There’s a **balancing act** here:
If you dedicate *more bits* to the **network**, you get *fewer bits* for **hosts**, and vice versa.

---

## 4. Subnet Masks and Address Classes

A **subnet mask** defines which bits are for the **network** and which are for the **host**.

Example:

```
255.0.0.0 → Class A
```

This means:

* The first 8 bits (one “quad”) are for the network.
* The remaining 24 bits are for hosts.

Address classes were an early way to provide flexibility for networks of different sizes:

| Class | Address Range               | Default Mask  | Network Bits | Host Bits    | Example Use     |
| ----- | --------------------------- | ------------- | ------------ | ------------ | --------------- |
| **A** | 0.0.0.0 – 127.255.255.255   | 255.0.0.0     | 8            | 24           | Large networks  |
| **B** | 128.0.0.0 – 191.255.255.255 | 255.255.0.0   | 16           | 16           | Medium networks |
| **C** | 192.0.0.0 – 223.255.255.255 | 255.255.255.0 | 24           | 8            | Small networks  |
| **D** | 224.0.0.0 – 239.255.255.255 | –             | –            | Multicast    |                 |
| **E** | 240.0.0.0 – 255.255.255.255 | –             | –            | Experimental |                 |

---

## 5. CIDR (Classless Inter-Domain Routing)

CIDR replaced address “classes” with **prefix notation**, allowing more flexible allocation of network and host bits.

Instead of saying “Class A” or “Class C”, we use **slash notation**:

* `10.0.0.0/8` means the first 8 bits are the network part.
* `192.168.1.0/24` means 24 bits for the network, 8 bits for hosts.

CIDR uses the **number of 1s in the subnet mask** as the prefix length:

```
255.255.255.0 → 11111111.11111111.11111111.00000000 → /24
```

> Even though the prefix comes **after** the address, it describes the **start** (network portion) of it.

CIDR also allows **partial bytes** to be used —
for example, `/20` means that part of the 3rd octet is used for network bits and the rest for hosts.

---

## 6. Common IPv4 Address Ranges

| Address            | Prefix   | Purpose                                                 |
| ------------------ | -------- | ------------------------------------------------------- |
| **10.0.0.0/8**     | Private  | Common in enterprise networks.                          |
| **172.16.0.0/12**  | Private  | Medium networks (e.g., VPNs).                           |
| **192.168.0.0/16** | Private  | Common for home routers (e.g., 192.168.1.1).            |
| **127.0.0.1**      | Loopback | “Localhost” — used to test your own device.             |
| **0.0.0.0**        | –        | “Any address” — often used as a default or placeholder. |
| **169.254.0.0/16** | APIPA    | Auto-assigned when DHCP fails.                          |

---

## 7. Ports — Communication Channels

Each device can have **many simultaneous network connections**, but they’re separated by **port numbers**.

Example:

```
127.0.0.1:4321
```

* `127.0.0.1` → The **IP address** (the device itself).
* `:4321` → The **port number** (a specific communication channel).

> Think of an IP address as your **house**, and **ports** as **entry points**:
>
> * **Front door (port 80):** Web traffic (HTTP).
> * **Back door (port 22):** SSH remote access.
> * **Window (port 443):** Secure HTTPS traffic.
> * **Cat flap (port 53):** DNS requests.
>
> Each “entry” allows a specific *type of traffic* — and some ports are open, while others are locked for security.

---

## 8. IPv6 — The Next Generation

### Structure

IPv6 uses **128 bits**, which is **four times larger** than IPv4’s 32 bits.
That means there are **2¹²⁸ possible addresses** — around **3.4 × 10³⁸** total.

It’s written as **8 groups of 16 bits**, shown in **hexadecimal** and separated by colons:

```
2001:0DC8:E004:0001:0000:0000:0000:0000
```

### Why IPv6?

IPv4 ran out of unique addresses.
IPv6 was designed to:

* Provide **virtually unlimited** address space.
* Simplify routing.
* Support **built-in encryption (IPsec)**.
* Remove the need for NAT (Network Address Translation).

---

## 9. IPv6 Simplification Rules

IPv6 addresses can look long — but we can shorten them safely using a few rules:

### 1. Leading Zero Suppression

Remove leading zeros in each 16-bit group:

```
2001:0db8:0000:0000:0000:0000:0000:0001 → 2001:db8:0:0:0:0:0:1
```

### 2. Consecutive Zero Compression

Replace one or more **consecutive groups of all zeros** with `::`

```
2001:db8:0:0:0:0:0:1 → 2001:db8::1
```

> The double colon (`::`) can **only be used once per address**, to avoid confusion about how many zero blocks were removed.

---

## 10. IPv6 Mixed Notation (Embedding IPv4)

IPv6 can include an **IPv4 address inside it** — mainly for backward compatibility.

Example:

```
::ffff:192.168.1.1
```

The last **32 bits** (the last quarter of the 128-bit address) represent the IPv4 portion.
Here’s why:

* IPv6 is **128 bits**.
* IPv4 is **32 bits**.
* `128 ÷ 32 = 4` → IPv4 takes up the **last quarter** of the address.
* Since IPv6 is **8 groups of 16 bits**, and each group is 2 bytes (16 bits × 8 groups = 128 bits),
  **the last 2 groups (32 bits)** can represent an IPv4 address.

Example in hex form:

```
::ffff:c0a8:0101 → ::ffff:192.168.1.1
```

This is known as an **IPv4-mapped IPv6 address**, used by systems that handle both IPv4 and IPv6 traffic (dual-stack environments).

---

## 11. IPv4 vs IPv6 Summary

| Feature              | IPv4              | IPv6                          |
| -------------------- | ----------------- | ----------------------------- |
| **Bit Length**       | 32 bits           | 128 bits                      |
| **Address Format**   | Dotted decimal    | Hexadecimal, colon-separated  |
| **Example**          | 192.168.1.1       | 2001:db8::1                   |
| **Total Addresses**  | ~4.3 billion      | ~3.4 × 10³⁸                   |
| **Subnetting**       | CIDR (/ notation) | Prefix-based (/ notation)     |
| **Configuration**    | Manual or DHCP    | Auto-configuration supported  |
| **Security (IPsec)** | Optional          | Built-in                      |
| **Broadcasts**       | Supported         | Replaced by multicast/anycast |
| **Compatibility**    | Legacy systems    | Modern networks               |
| **Dual Stack**       | Used together     | Common during transition      |

---

## 12. Key Takeaways

* **IPv4** = 32-bit, limited, still dominant but slowly being replaced.
* **IPv6** = 128-bit, massive space, faster routing, and designed for modern networking.
* **CIDR** = Flexible method for assigning network vs host bits.
* **Ports** = Communication channels within one IP address.
* **Mixed notation** = Allows IPv4 addresses to live inside IPv6.

> **Quick Recap:**
>
> * IPv4 = “Tight city with limited space.”
> * IPv6 = “A new, endless frontier.”