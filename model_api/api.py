import json
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from tensorflow import keras
import numpy as np
from sklearn.preprocessing import StandardScaler
from joblib import dump, load

# Class for various generational data runIndex might encounter.


class Generation:
    names = []
    genNumber = 0

    def __init__(self, initNames, initGenNumber):
        self.genNumber = initGenNumber
        self.names = initNames

# Class for various cancers runIndex might encounter.


class Cancer:
    names = []
    hRisk = 1.0
    avgAge = 60

    def __init__(self, initNames, initHRisk, initAvgAge):
        self.names = initNames
        self.hRisk = initHRisk
        self.avgAge = initAvgAge


# List of generational data
generations = []
generations.append(Generation(["greatgrand"], 3))
generations.append(Generation(
    ["grand", "greataunt", "greatuncle", "cousin"], 2))
generations.append(Generation(["mother", "father", "aunt", "uncle"], 1))

# List of cancers
cancers = []
cancers.append(Cancer(["colon"], 1, 50))
cancers.append(Cancer(["breast"], 1, 45))
cancers.append(Cancer(["pancreatic", "pancreas"], 1, 45))
cancers.append(Cancer(["uterine", "uterus"], 1, 50))
cancers.append(Cancer(["ovarian"], 1, 50))
cancers.append(Cancer(["brain"], 1, 20))
cancers.append(Cancer(["kidney"], 1, 50))
cancers.append(Cancer(["eye"], 1, 55))
cancers.append(Cancer(["leukemia"], 0.25, 60))
cancers.append(Cancer(["melonoma", "carcinoma"], 0.5, 40))
cancers.append(Cancer(["skin", "liver", "bladder", "thyroid", "lung", "oral",
               "cervical", "cervix", "testicular", "testicle", "lymphoma", "myeloma"], 0, 60))
# Initializing Flask app.
app = Flask(__name__)
CORS(app)
api = Api(app)

# Loading the keras model.
scaler = load('std_scaler.bin')
model = keras.models.load_model('probModel')

# Algorithm that decides a risk index based on heriditary data


def runIndex(genData, cancerData, ageData):
    points = 0
    try:
        for index in range(0, len(genData)):
            gNumber = 1.5
            hNumber = 1
            avgAge = 50
            if (genData[index] != ""):
                try:
                    for generation in generations:
                        for name in generation.names:
                            if name in genData[index].lower():
                                gNumber = generation.genNumber
                                break
                            else:
                                continue
                            break
                except:
                    gNumber = 1.5
                    errorCount += 1
                try:
                    for cancer in cancers:
                        for name in cancer.names:
                            if name in cancerData[index].lower():
                                hNumber = cancer.hRisk
                                avgAge = cancer.avgAge
                                break
                            else:
                                continue
                            break
                except:
                    hNumber = 0
                    avgAge = 50.0
                    errorCount += 1
                try:
                    if ageData[index] != "":
                        age = float(ageData[index])
                        age = 50.0
                    else:
                        age = avgAge
                except:
                    age = avgAge
                index = (avgAge/age)*(hNumber)*(1.00/pow(2, gNumber))
                points += index
            else:
                continue
    except:
        points = 0
    return points


# Api endpoint for a model prediction.
class Prediction(Resource):

    def post(self):
        json_data = request.get_json(force=True)
        raceStr = json_data['ethnicity']
        genData = json_data['rel_relation']
        cancerData = json_data['rel_cancer']
        ageData = json_data['rel_age']
        index = runIndex(genData, cancerData, ageData)
        ethIndex = 0
        try:
            if "white" in raceStr.lower():
                ethIndex = 0
            elif "cau" in raceStr.lower():
                ethIndex = 0
            elif "black" in raceStr.lower():
                ethIndex = 1
            elif "afri" in raceStr.lower():
                ethIndex = 1
            elif "hispan" in raceStr.lower():
                ethIndex = 2
            else:
                ethIndex = 3
        except:
            ethIndex = 0
        ethIndex = float(ethIndex)
        matrix = model.predict(
            np.array(scaler.transform([[ethIndex, index]])))[0]
        pred = np.argmax(matrix)
        pred = pred.item()
        return {'prediction': float(pred), 'matrix': matrix.tolist()}


# Configuring api
api.add_resource(Prediction, '/api')


if __name__ == '__main__':
    app.run(threaded=True, port=5000)
