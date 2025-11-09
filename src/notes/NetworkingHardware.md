---
title: "Network Devices and Media Overview"
description: "What hardware and devices do we use in an average computer network?"
publishDate: "2025-11-08"
category: "Networking Basics"
---
## 1. Signal and Connectivity Devices

### Repeater
- **Function:** Regenerates (repeats) electrical or optical signals to extend transmission distance.  
- **Note:** It does **not amplify** the signal — it cleans and retransmits it at its original strength and shape.

### Hub
- **Function:** A *multiport repeater* that broadcasts incoming signals to **all ports**.  
- **Limitations:**  
  - No traffic management or filtering.  
  - Creates a **single collision domain**, reducing efficiency.  
  - Rarely used in modern networks.

### Bridge
- **Function:** Connects and filters traffic between two or more network segments (LANs) at **Layer 2** (Data Link layer).  
- **Key Advantage:** Uses **MAC addresses** to forward data only to the relevant port, reducing unnecessary traffic.  
- **Comparison:**  
  - A **hub** sends data to every connected device.  
  - A **bridge** sends data only where it’s needed.

### Switch
- **Function:** A multiport bridge that operates primarily at **Layer 2 (Data Link)**, directing frames based on MAC addresses.  
- **Types:**
  - **Layer 2 Switch:** Operates using MAC addresses for switching within a LAN.  
  - **Layer 3 Switch:** Adds **routing capabilities** using IP addresses — effectively combines switch and router functions in hardware.

### Router
- **Function:** Operates at **Layer 3 (Network layer)** to route packets between networks using **IP addresses**.  
- **Hardware vs Software Routing:**  
  - **Routers** perform routing in **software** (more flexible but slightly slower).  
  - **Layer 3 switches** handle routing in **hardware** (faster but less flexible).  
- **Benefits of Routers:** Can include advanced features like firewalls, VPNs, threat protection, and network segmentation.

### Modem
- **Function:** Converts (modulates/demodulates) digital data into analog signals and vice versa for transmission over analog media (e.g., telephone lines).  
- **Name Origin:** *Mo*dulator-*Dem*odulator.  
- **Example:** Converts digital signals from a computer into tones suitable for analog phone lines.

### Token Passing
- **Concept:** A network access method where a special frame called a *token* circulates among nodes.  
- **Rules:**  
  - Only the device holding the token may transmit.  
  - Prevents collisions and ensures fair access.  
- **Example Technologies:** Token Ring, FDDI (historical).

---

## 2. Transmission Media

### Copper Cables

#### Twisted Pair
- **Function:** Two copper wires twisted together to reduce electromagnetic interference (EMI).  
- **Reasoning:** The twisting cancels out noise induced by external magnetic fields and from neighboring pairs.  
- **Types:**  
  - **UTP (Unshielded Twisted Pair)**  
  - **STP (Shielded Twisted Pair)**  
- **Use Case:** Ethernet cabling (Cat5e, Cat6, Cat6a, etc.).

#### Coaxial Cable
- **Structure:** Central conductor, insulating layer, metallic shield (usually copper mesh), and outer jacket.  
- **Purpose:** Shielding protects against EMI — particularly important when cables are bundled together.  
- **Use Case:** Older Ethernet (10Base2/10Base5), cable Internet, CCTV.

---

### Optical Fiber

- **Function:** Transmits data as pulses of light through glass or plastic fibers.  
- **Advantages:**  
  - Much higher bandwidth than copper.  
  - Immune to electromagnetic interference.  
  - Can transmit over longer distances with less signal loss.  
- **Modes:**  
  - **Single-mode (SMF):** Thin core; carries a single light path; used for long distances (e.g., backbone connections).  
  - **Multimode (MMF):** Thicker core; carries multiple light paths; used for shorter runs (e.g., building networks).  
- **Multiplexing:** Multiple light wavelengths (colors) can carry separate signals simultaneously — known as **Wavelength Division Multiplexing (WDM)**.  
- **Signal Integrity:** Optical *dispersion* and *convergence* can cause interference; careful distance planning or correction math prevents this.

---

## Summary Table

| Device/Medium | OSI Layer | Function Summary |
|----------------|------------|------------------|
| Repeater | 1 (Physical) | Regenerates signals |
| Hub | 1 (Physical) | Broadcasts data to all ports |
| Bridge | 2 (Data Link) | Forwards frames by MAC address |
| Switch | 2 / 3 | Directs traffic efficiently within LANs; some perform routing |
| Router | 3 (Network) | Routes packets between networks |
| Modem | 1 (Physical) | Converts digital ↔ analog signals |
| Token Passing | Data Link (Method) | Manages media access without collisions |
| Twisted Pair | 1 (Physical) | Copper cable minimizing interference |
| Coaxial Cable | 1 (Physical) | Shielded copper cable |
| Fiber Optic | 1 (Physical) | Transmits data as light for high speed and distance |

---

**Key Takeaway:**  
Modern networks primarily use **switches and routers**, with **fiber** increasingly replacing copper for high-speed backbones. Legacy devices like **hubs, bridges, and token-based networks** are mostly historical but foundational for understanding today’s networking principles.