from ATE.Tester.TES.apps.testApp.sequencers.MqttClient import MqttClient


class AccelerationProxy():
    def set_mqtt_client(self, mqtt: MqttClient):
        self.mqtt = mqtt

# TBD: API for the Acceleration Actuator
