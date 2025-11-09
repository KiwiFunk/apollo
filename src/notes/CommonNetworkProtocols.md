---
title: "Network Protocols"
description: "Some widely used protocols, and their purposes."
publishDate: "2025-11-08"
category: "Networking Basics"
---
# Common Network Protocols

This table summarizes widely used protocols, their purposes, and key characteristics.

| Protocol  | Full Name                           | Purpose                                              | Key Details / Ports                                                        |
| --------- | ----------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| **DNS**   | Domain Name System                  | Resolves human-readable domain names to IP addresses | Uses **UDP port 53** (sometimes TCP for large queries)                     |
| **FTP**   | File Transfer Protocol              | Transfers files between client and server            | Uses **TCP ports 20 (data), 21 (control)**                                 |
| **HTTP**  | Hypertext Transfer Protocol         | Standard web traffic                                 | **TCP port 80**                                                            |
| **HTTPS** | HTTP Secure                         | Encrypted web traffic                                | **TCP ports 443, sometimes 8080**                                          |
| **DHCP**  | Dynamic Host Configuration Protocol | Automatically assigns IP addresses to devices        | Uses **UDP ports 67 (server) and 68 (client)**                             |
| **ICMP**  | Internet Control Message Protocol   | Network diagnostics, e.g., ping, traceroute          | Works at the **Network Layer**, no port numbers                            |
| **UDP**   | User Datagram Protocol              | Fast, connectionless transport                       | Fire-and-forget: used for streaming, gaming, VoIP. Minimal error checking. |
| **TCP**   | Transmission Control Protocol       | Reliable transport                                   | Manages **packet loss, sequencing, and buffering**. Connection-oriented.   |

---

## Quick Notes

* **TCP vs UDP:**

  * **TCP**: reliable, ensures all packets arrive, ordered, connection-oriented.
  * **UDP**: fast, “fire and forget,” no guarantee of delivery, connectionless.

* **DNS & DHCP** are **critical infrastructure protocols** for addressing and name resolution.

* **ICMP** is primarily used for **network testing and troubleshooting**, not regular data transfer.