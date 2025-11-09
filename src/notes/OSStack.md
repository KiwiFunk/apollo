---
title: "The OS Stack, An Overview"
description: "What exactly is the OS Stack? How does a computer work?"
publishDate: "2025-11-06"
category: "CompSci Basics"
---
## Operating System (OS) Stack Overview

The **OS stack** represents the layers of components that work together to make a computer system functional - from the physical hardware to the applications you interact with. Each layer has a specific role and builds on the one below it.

### **1. Hardware**

- The physical components of the computer: CPU, memory, storage, input/output devices.
- Executes machine instructions and provides the foundation for all higher-level operations.

### **2. BIOS (Basic Input/Output System)**

- Firmware stored on the motherboard.
- Initializes hardware during boot and provides low-level routines for input/output.
- Loads the **bootloader**, which starts the operating system.

### **3. Kernel**

- The core of the operating system.
- Manages hardware resources (CPU, memory, devices) and provides essential services to applications.
- Handles process scheduling, memory management, and device drivers.
- Example: Linux (The core Linux Kernel)

### **4. Operating System**

- The software layer that provides an interface between the user and hardware.
- Includes system utilities, file management, networking, and security.
- Examples: Windows, KDE Linux (The Distro that includes a Kernel and OS), macOS.

### **5. Applications**

- Programs that perform tasks for the user (e.g., browsers, word processors, games).
- Rely on OS services for hardware access and resource management.

### **6. End User**

- The person interacting with the system through applications.
- Uses input devices (keyboard, mouse, touchscreen) and receives output via display, speakers, etc.

### **Visual Diagram**

    End User  ← interacts with Apps
       ↑
    Apps      ← rely on OS services
       ↑
    OS        ← provides interface & utilities
       ↑
    Kernel    ← manages resources & drivers
       ↑
    BIOS      ← initializes hardware & boots OS
       ↑
    Hardware  ← physical components

### **Key Points**

*   Each layer depends on the one below it.
*   The kernel is the critical bridge between hardware and software.
*   The OS abstracts hardware complexity for applications.
*   BIOS ensures the system can start and hand control to the OS.

## System Calls and Drivers

**System Calls**

*   Interface between user applications and the kernel.
*   Allow programs to request services from the OS (file operations, process control, networking).
*   Examples:
    *   `open()` – Open a file
    *   `read()` – Read data from a file
    *   `write()` – Write data to a file
    *   `fork()` – Create a new process
    *   `exec()` – Execute a new program
    *   `socket()` – Create a network socket

**Device Drivers**

*   Specialized programs within the kernel.
*   Manage communication between the OS and hardware devices.
*   Translate generic OS commands into device-specific operations.