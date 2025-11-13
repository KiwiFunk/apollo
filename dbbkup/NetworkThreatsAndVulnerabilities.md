---
title: "Network Threats and Vulnerabilities"
description: "There are lots of potential threats to a network, what should we look out for?"
publishDate: "2025-11-08"
category: "Networking Basics"
---
## 1. Physical Layer Threats

| Threat                         | Description                                                   | Real-World Example                                                                                         |
| ------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Loss of Power                  | Network devices or servers shut down, causing downtime.       | **Amazon AWS Outage 2017** – Power issues in a data center affected multiple services.                     |
| Physical Theft                 | Stealing servers, laptops, or storage devices to access data. | **Target 2013 Breach** – Attackers stole network credentials after physical access to HVAC vendor systems. |
| Physical Damage                | Fire, flooding, or accidental destruction of hardware.        | **OVH Cloud Fire 2021** – Data loss due to a major fire at a European data center.                         |
| Cable Keyloggers / Tap Devices | Devices intercept signals between machines.                   | **ATM Skimming Devices** – Physical taps on ATM networks to steal card information.                        |

---

## 2. Data Link Layer Vulnerabilities

| Threat                   | Description                                                 | Real-World Example                                                                            |
| ------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| ARP Spoofing / Poisoning | Fake ARP messages redirect traffic to attacker’s machine.   | **LAN MITM Attacks in Universities** – Students captured traffic on open Wi-Fi networks.      |
| MAC Flooding / Cloning   | Overloads switch tables or impersonates legitimate devices. | **Kali Linux “macof” Tool** – Floods switch MAC tables to force it into broadcast mode.       |
| Port Stealing / MITM     | Attacker tricks a switch to send traffic to their machine.  | **Corporate LAN MITM** – Attackers intercept sensitive emails inside office LANs.             |
| DHCP Attacks             | Starvation or rogue DHCP servers giving malicious IPs.      | **Rogue Wi-Fi Hotspots** – Attackers spoof DHCP to route traffic through a malicious gateway. |

---

## 3. Network Layer Threats

| Threat         | Description                                  | Real-World Example                                                                                      |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Route Spoofing | Fake routing information misdirects traffic. | **BGP Hijacking** – In 2018, a Nigerian ISP accidentally routed traffic for Google through its network. |
| IP Spoofing    | Malicious packets use forged IP addresses.   | **Smurf Attack** – Amplified DDoS using spoofed source IPs.                                             |

---

## 4. Transport Layer Threats

| Threat        | Description                                              | Real-World Example                                                         |
| ------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| BEAST Attack  | Exploits SSL/TLS vulnerability to decrypt HTTPS traffic. | **BEAST 2011** – Exploited TLS 1.0 to steal secure cookies.                |
| TCP SYN Flood | Overwhelms a server with incomplete TCP connections.     | **GitHub 2018 DDoS** – Large-scale SYN flood attack mitigated with Akamai. |

---

## 5. Application Layer Threats

| Threat                             | Description                                        | Real-World Example                                                                           |
| ---------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Heartbleed                         | Exploited a flaw in OpenSSL to read server memory. | **2014 Heartbleed** – Millions of HTTPS sites affected, exposing passwords and private keys. |
| Cloudflare / CDN Misconfigurations | Improper caching or firewall rules exposing data.  | **Cloudflare Leak 2017 (“Cloudbleed”)** – Sensitive data leaked from cached web pages.       |
| SQL Injection / XSS                | Attackers inject malicious code into websites.     | **Sony Pictures 2011 Hack** – Used multiple application-level exploits to steal data.        |

---

## 6. IDS and IPS in Action

* **NIDS Example:** Snort detecting unusual DNS traffic patterns indicating malware.
* **HIDS Example:** OSSEC alerting when system files are unexpectedly modified.
* **IPS Example:** Cisco Firepower automatically blocking incoming SYN flood packets.

---

## Quick Takeaways with Real-World Context

* **Physical layer attacks** may seem simple but are highly effective—data centers and offices need strict security.
* **Layer 2 attacks** exploit LAN trust—ARP spoofing and MAC flooding are classic for MITM.
* **Layer 3 attacks** manipulate routing—BGP hijacks can accidentally reroute the Internet.
* **Layer 4 attacks** focus on transport reliability—SYN floods and SSL exploits like BEAST target TCP/TLS.
* **Application layer exploits** like Heartbleed show how software bugs at the top of the stack can compromise millions.
* **IDS/IPS systems** are critical for detecting and preventing both internal and external threats.