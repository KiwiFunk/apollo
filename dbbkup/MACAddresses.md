---
title: "MAC Addresses"
description: "I know what an IP is - So what's a MAC Address?"
publishDate: "2025-11-08"
category: "Networking Basics"
---
## 1. What is a MAC Address?

A **MAC (Media Access Control) address** is a **unique hardware identifier** assigned to a device’s **network interface card (NIC)**.
It operates at **Layer 2 (Data Link layer)** of the OSI model and ensures that data sent on a local network reaches the correct physical device.

> Think of it like a **serial number** for your network hardware — unique to each device.

---

## 2. Structure of a MAC Address

A MAC address is made up of **6 pairs of hexadecimal values** (12 hex digits total), separated by colons or hyphens.
Each pair represents **8 bits (1 byte)**, so a full MAC address is **48 bits** long.

### Example:

```
00:1A:2B:3C:4D:5E
```

* **00:1A:2B** → **Organizationally Unique Identifier (OUI)**
  Assigned by the IEEE to identify the manufacturer (e.g., Intel, Cisco, Apple).

* **3C:4D:5E** → **Network Interface Controller (NIC) Specific**
  Assigned by the manufacturer — unique to that specific device.

---

## 3. Characteristics

* **Physically embedded:**
  Stored in the hardware during manufacturing.

* **Hardcoded (usually):**
  It’s “burned” into the device’s network card — designed to be permanent.

* **Can be spoofed:**
  Software can temporarily change (“spoof”) a MAC address, often for testing, privacy, or bypassing filters.

* **Locally significant vs globally unique:**

  * **Globally unique** → Default from manufacturer.
  * **Locally administered** → Modified manually or by software.

---

## 4. Quick Facts

| Property            | Value                                      |
| ------------------- | ------------------------------------------ |
| **Total Bits**      | 48                                         |
| **Format**          | 6 pairs of hex (e.g., `AA:BB:CC:DD:EE:FF`) |
| **Example**         | `00:1A:2B:3C:4D:5E`                        |
| **Top 3 bytes**     | Manufacturer (OUI)                         |
| **Bottom 3 bytes**  | Device-specific                            |
| **Layer**           | Data Link (Layer 2)                        |
| **Can be changed?** | No (physically), Yes (spoofed)             |

---

## 5. Summary

* The **MAC address** uniquely identifies a network device within a **local network segment**.
* It’s **assigned by manufacturers**, composed of **6 hexadecimal pairs**, and stored in hardware.
* While **hardcoded**, it can be **temporarily changed (spoofed)** by software.
* It’s used for **local delivery**, not routing — IP handles communication beyond the local network.

> **In short:**
> IP = “where” a device is (logical address).
> MAC = “who” the device is (physical address).

## How do MAC and IP Addresses Work Together?

When a device wants to send data on a local network (LAN), it needs **both the IP address and the MAC address** of the destination. Here’s the typical process:

```mermaid
flowchart LR
    A[Device A: Wants to send data to 192.168.1.5] --> B[Check ARP Table: Does it know MAC for 192.168.1.5?]
    B -- No --> C[Send ARP Request: "Who has 192.168.1.5?"]
    C --> D[Device B (192.168.1.5) replies with its MAC: 00:1A:2B:3C:4D:5E]
    D --> B[Device A updates ARP table with IP → MAC mapping]
    B --> E[Device A sends Ethernet frame: Destination MAC = 00:1A:2B:3C:4D:5E]
    E --> F[Device B receives frame, checks MAC, accepts payload]
```

---

## Step-by-Step Explanation

1. **Device A wants to send data to Device B**

   * Device A knows Device B’s IP (`192.168.1.5`) but not its MAC.

2. **Check ARP Table**

   * The **ARP (Address Resolution Protocol) table** stores known IP → MAC mappings.
   * If the MAC is unknown, Device A broadcasts an **ARP request**.

3. **ARP Request & Reply**

   * All devices on the local network see the broadcast, but only Device B replies with its **MAC address**.

4. **Update ARP Table**

   * Device A now stores the IP → MAC mapping for future use.

5. **Send Data Using Ethernet Frame**

   * Device A wraps the payload in a **frame** addressed to Device B’s MAC.
   * The frame travels over the local network and is accepted by Device B.

---

## A brief summary

* **IP address**: Logical address, used for identifying devices **across networks**.
* **MAC address**: Physical address, used for identifying devices **within the local network**.
* **ARP**: Bridges the gap between IP and MAC so data reaches the correct hardware.
* Every LAN transmission relies on **both IP (where) and MAC (who)**.