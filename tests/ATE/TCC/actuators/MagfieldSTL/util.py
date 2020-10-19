from ATE.TCC.Actuators.MagfieldSTL.communication.CommunicationChannel import CommunicationChannel


class DummyCommChan(CommunicationChannel):

    def __init__(self):
        self.sent_data = []
        self.received_data = []

    def send(self, data):
        # This will throw, if data was sent, if no data was expected
        next_sent_item = self.sent_data.pop()

        sent_data_string = data.decode("utf-8")
        # This will throw if data was sent, that does not match expected data.
        assert(next_sent_item == sent_data_string)

    def receive(self, timeout):
        return self.received_data.pop()

    def expect_send_with_reply(self, data_to_send, reply):
        self.received_data.append(reply)
        actual_data = f"{data_to_send}\r\n"
        self.sent_data.append(actual_data)

    def check_send_expectations(self):
        fail = False
        for sends in self.sent_data:
            fail = True
        assert(not fail)
