import json
from channels.generic.websocket import WebsocketConsumer

class GroupChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        self.send(json.dumps({
            "user": self.scope["user"].username,
            "message": data["message"]
        }))
