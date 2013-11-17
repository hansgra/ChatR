using System;
using System.Collections.Generic;
using Microsoft.AspNet.SignalR;

namespace ChatR
{
    public class ChatHub : Hub
    {
        private static readonly List<string> Users = new List<string>();

        public void Send(string name, string message, DateTime date)
        {
            date.AddHours(2);
            var formattedDate = date.ToString("dd.MM.yyyy hh:mm:ss");
            Clients.All.broadcastMessage(name, message, formattedDate);
        }

        public void Login(string name)
        {
            Users.Add(name);
            Clients.All.broadcastUsers(Users);
        }
    }
}