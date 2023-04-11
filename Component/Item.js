import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DialogInput from 'react-native-dialog-input';

const width = Dimensions.get("window").width;

export default Item = ({item,cat,changeCatData,catTotal}) => {
    const [itemData,setItemData] = useState({score:item.score,total:cat.total})
    const [visible, setVisible] = useState(false)
    const [note, setNote] = useState(item.note)

    const add = () => {
        let score = itemData.score // y or n
        let total = catTotal
        if(score != 'y'){
            score = 'y'
            total += item.maxGrade
            const newData = {
                score,
                total
            }
            setItemData({...newData})
            let newCat = cat
            newCat.questions[item.id].score = score
            newCat.total = total
            changeCatData(newCat)
        }
      }
    
    const sub = () => {
        let score = itemData.score
        let total = catTotal
        if(score != 'n'){
            score = 'n'
            total -= item.maxGrade
            const newData = {
                score,
                total
            }
            setItemData({...newData})
            let newCat = cat
            newCat.questions[item.id].score = score
            newCat.total = total
            changeCatData(newCat)
        }
    }

    const addNote = (note) => {
        setVisible(false)
        setNote(note)
        let newCat = cat
        newCat.questions[item.id].note = note
        changeCatData(newCat)
    }

    return(
        <SafeAreaProvider>
            <View style={styles.container}>
                <TextInput
                        readOnly
                        value={item.question}
                        multiline
                        numberOfLines={3}
                        style={[styles.textStyle,{width:'70%',height:'100%',textAlignVertical:'top',padding:10}]}
                        scrollEnabled={false}
                />
                <View style={[styles.addAndSubOutterView,{minWidth:'30%',maxWidth:'30%'}]}>
                    <TouchableOpacity 
                        style={styles.addAndSubBtu}
                        onPress={add}
                    >
                        <Text style={styles.addAndSubView}>
                            Y
                        </Text>
                    </TouchableOpacity>
                    <View style={[styles.scoreView,{backgroundColor: itemData.score == 'n'? 'red' : 'green'}]}>
                        <Text style={styles.scoreText}>
                            {itemData.score}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.addAndSubBtu}
                        onPress={sub}
                    >
                        <Text style={styles.addAndSubView}>
                            N
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {itemData.score != 'n'?
                <></>
            :
                <View style={styles.container}>
                    <DialogInput isDialogVisible={visible}
                        title={"ملاحظة"}
                        message={"الرجاء ادخال الملاحظة"}
                        initValueTextInput ={note}
                        submitText={"ADD"}
                        submitInput={ (inputText) => {
                        addNote(inputText)
                        } }
                        closeDialog={ () => {setVisible(false)}}>
                    </DialogInput>
                    <TouchableOpacity
                        style={{width:'100%',height:'100%'}}
                        onPress={() => setVisible(true)}
                    >
                        {note == ''?
                        <Text 
                            style={{width:'100%',height:'100%',textAlignVertical:'top',padding:10,fontSize:15}}
                        >
                            لا يوجد
                        </Text>
                        :
                        <Text
                            style={{width:'100%',height:'100%',textAlignVertical:'top',padding:10,fontSize:15}}
                        >
                            {note}
                        </Text>
                        }
                    </TouchableOpacity>
                    {/* <TextInput
                        // value={catNote}
                        multiline
                        numberOfLines={3}
                        maxLength={500}
                        placeholder="لا يوجد"
                        style={[styles.textStyle,{width:'100%',height:'100%',textAlignVertical:'top',padding:10}]}
                        scrollEnabled={true}
                    /> */}
                </View>
            }
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:width,
        height:100,
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:"#082032"
    },
    textStyle:{
        color:"#082032",
        fontSize:15
    },
    textButtons:{
        flex:1,
        width:width,
        height:50,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    textContainer:{
        flex:1,
        height:300,
        width:width,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    text:{
        height:'90%',
        width:'90%',
        padding: 10,
        color:"#082032",
        borderBottomColor:"#082032",
        textAlignVertical:'top',
        borderWidth:3,
        borderRadius:10
    },
    addAndSubOutterView:{
        inHeight:'100%',
        maxHeight:'100%',
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
      },
      addAndSubBtu:{
        height:30,
        width:30,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
      },
      addAndSubView:{
        minHeight:30,
        minWidth:30,
        maxHeight:30,
        maxWidth:30,
        borderRadius:15,
        textAlign:'center',
        textAlignVertical:'center',
        color:'#fff',
        backgroundColor:"#082032",
      },
      scoreView:{
        height:40,
        minWidth:30,
        maxWidth:30,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        borderColor:"#082032",
        borderWidth:2
      },
      scoreText:{
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:15,
        fontWeight:'bold',
        color:'#fff'
      },
      maxGradeView:{
        height:40,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#082032',
        borderColor:"#082032",
        borderWidth:2
      },
      maxGradeText:{
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:15,
        color:'#fff',
        fontWeight:'bold'
      },
})