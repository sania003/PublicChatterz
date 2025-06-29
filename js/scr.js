const canvas = document.getElementById("chatCanvas");
      const ctx = canvas.getContext("2d");

      // Draw Sidebar
      ctx.fillStyle = "#2c2f33";
      ctx.fillRect(0, 0, 200, 600);

      // Sidebar Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "24px Arial";
      ctx.fillText("Channels", 20, 40);

      ctx.font = "18px Arial";
      ctx.fillText("# general", 20, 80);
      ctx.fillText("# random", 20, 120);
      ctx.fillText("# support", 20, 160);

      // Draw Chat Header
      ctx.fillStyle = "#7289da";
      ctx.fillRect(200, 0, 600, 50);

      // Chat Header Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "18px Arial";
      ctx.fillText("# general", 220, 30);

      // Draw Chat Messages Area
      ctx.fillStyle = "#f1f1f1";
      ctx.fillRect(200, 50, 600, 500);

      // Chat Messages
      const messages = [
        { user: "User1", text: "Hello everyone!" },
        { user: "User2", text: "Hi User1! How are you?" },
        { user: "User1", text: "I'm good, thanks! How about you?" },
      ];

      ctx.fillStyle = "#000000";
      ctx.font = "16px Arial";
      messages.forEach((msg, index) => {
        const y = 80 + index * 60;
        ctx.fillText(msg.user, 220, y);
        ctx.fillText(msg.text, 240, y + 20);
      });

      // Draw Chat Input
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(200, 550, 600, 50);
      ctx.strokeStyle = "#ddd";
      ctx.strokeRect(200, 550, 600, 50);

      // Chat Input Placeholder
      ctx.fillStyle = "#888888";
      ctx.font = "16px Arial";
      ctx.fillText("Type a message...", 220, 580);