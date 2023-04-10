import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import * as apis from "../apis/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../Component/Loader";

const dim = Dimensions.get("window").width * 0.2;

export default function LoginScreen({ navigation }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function showPassword(value) {
    setShowPass(value);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (username !== null) {
          navigation.navigate("Rate",{
            username:username,
            data:undefined
          });
        }
      } catch (e) {}
    };
    getData();
  }, []);

  async function submit() {
    if (user != "" && pass != "") {
      setLoading(true);
      const data = await apis.getUser(user,pass);
      if (data.status == "success") {
        setLoading(false);
        const storeData = async () => {
          try {
            await AsyncStorage.setItem("username", data.username);
            setUser("");
            setPass("");
            navigation.navigate("Rate",{
              username:user,
              data:data.data
            });
          } catch (e) {
            alert("خطا داخلي الرجاء اعادة المحاولة");
          }
        };
        storeData(); 
      }else {
        setLoading(false);
        alert(data.msg);
      }
    } else {  
      alert("الرجاء تعبئة جميع البيانات");
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.screen}>
        <Loader loading={loading} />
          {/* <Image style={styles.image} source={require("../img/logo.png")} /> */}
          <View style={styles.userView}>
            <FontAwesome name="user-circle" size={dim * 0.85} color="black" />
          </View>
          <Text style={styles.labelTextUser}>USERNAME</Text>
          <TextInput
            style={styles.inputUser}
            placeholder={"Username"}
            value={user}
            onChangeText={(text) => setUser(text)}
            textAlign={"center"}
            editable={true}
          />
          <Text style={styles.labelTextPass}>PASSWORD</Text>
          <TextInput
            style={styles.inputPass}
            placeholder={"password"}
            value={pass}
            onChangeText={(text) => setPass(text)}
            textAlign={"center"}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity
            style={styles.boxView}
            onPress={() => showPassword(!showPass)}
          >
            <Checkbox
              value={showPass}
              onValueChange={showPassword}
              style={styles.checkbox}
              color={{ true: "#fff" }}
            />
            <Text style={styles.boxText}>SHOW PASSWORD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginBtu}
            onPress={() => {
              submit();
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#082032",
  },
  image: {
    height: 100,
    width: 100,
    opacity: 1,
    marginTop: 70,
  },
  userView: {
    marginTop: 35,
    height: dim,
    width: dim,
    borderRadius: dim * 0.5,
    borderColor: "#FFC947",
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  labelTextUser: {
    marginTop: 30,
    fontSize: 23,
    color: "#fff",
    marginBottom: 5,
  },
  inputUser: {
    height: 60,
    padding: 10,
    borderRadius: 20,
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#FFC947",
    color: "black",
    width: "80%",
  },
  labelTextPass: {
    marginTop: 10,
    fontSize: 23,
    color: "#fff",
    marginBottom: 5,
  },
  inputPass: {
    height: 60,
    padding: 10,
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 20,
    backgroundColor: "#FFC947",
    color: "black",
    width: "80%",
    marginBottom: 10,
  },
  boxView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  checkbox: {
    marginRight: 10,
    borderColor: "#fff",
  },
  boxText: {
    fontSize: 15,
    color: "#fff",
    marginRight: 10,
  },
  loginBtu: {
    height: 60,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#FFC947",
    marginBottom: 20,
  },
  lastView: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  btu: {
    height: 40,
    padding: 10,
    width: "45%",
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#FFC947",
  },
});
