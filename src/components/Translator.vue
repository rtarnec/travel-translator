<template>
  <div>
    <div>
      <template v-if="showCard">
        <v-card :loading="loading" class="mx-auto my-4" max-width="374">
          <v-img v-if="uploadedImgUrl" :src="uploadedImgUrl" aspect-ratio="1.33" />
          <transition @before-enter="beforeEnter" @enter="enter" :css="false">
            <div v-if="showOCRResults">
              <v-card-text>
                <div class="my-4 subtitle-1 black--text">Original Language: {{ originalLanguage }}</div>
              </v-card-text>
              <v-divider class="mx-4"></v-divider>
              <v-card-title>Translation</v-card-title>
              <v-card-text>{{ translatedText }}</v-card-text>
            </div>
          </transition>
        </v-card>
      </template>
    </div>
    <transition @before-enter="beforeEnter" @enter="enter" :css="false">
      <div v-if="showUploadButton" class="d-flex justify-center my-8">
        <div class="pa-2">
          <v-btn dark fab color="primary" @click="onSelectFile">
            <v-icon>add_a_photo</v-icon>
          </v-btn>
          <input type="file" style="display: none" ref="fileInput" @change="uploadFile" />
        </div>
      </div>
    </transition>
    <div class="d-flex justify-center my-8">
      <div class="pa-2 caption">
        <router-link to="/terms">Terms of Use</router-link>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="570">
      <v-card>
        <v-card-title class="headline pb-7">{{ dialogTitle }}</v-card-title>
        <v-card-text class="subtitle-1">{{ dialogText }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="hideDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Velocity from "velocity-animate";
import { db, storage } from "@/firebaseConfig.js";
export default {
  name: "HelloWorld",
  data() {
    return {
      firestoreDocListener: null,
      originalLanguage: null,
      translatedText: null,
      uploadedImgUrl: null,
      loading: false,

      showUploadButton: true,
      showCard: false,
      showOCRResults: false,

      dialogTitle: null,
      dialogText: null,
      dialog: false,

      languageCodes: [
        {
          code: "af",
          language: "Afrikaans"
        },
        {
          code: "sq",
          language: "Albanian"
        },
        {
          code: "am",
          language: "Amharic"
        },
        {
          code: "ar",
          language: "Arabic"
        },
        {
          code: "hy",
          language: "Armenian"
        },
        {
          code: "az",
          language: "Azerbaijani"
        },
        {
          code: "eu",
          language: "Basque"
        },
        {
          code: "be",
          language: "Belarusian"
        },
        {
          code: "bn",
          language: "Bengali"
        },
        {
          code: "bs",
          language: "Bosnian"
        },
        {
          code: "bg",
          language: "Bulgarian"
        },
        {
          code: "ca",
          language: "Catalan"
        },
        {
          code: "ceb",
          language: "Cebuano"
        },
        {
          code: "zh",
          language: "Chinese"
        },
        {
          code: "zh-CN",
          language: "Chinese"
        },
        {
          code: "zh-TW",
          language: "Chinese"
        },
        {
          code: "co",
          language: "Corsican"
        },
        {
          code: "hr",
          language: "Croatian"
        },
        {
          code: "cs",
          language: "Czech"
        },
        {
          code: "da",
          language: "Danish"
        },
        {
          code: "nl",
          language: "Dutch"
        },
        {
          code: "en",
          language: "English"
        },
        {
          code: "eo",
          language: "Esperanto"
        },
        {
          code: "et",
          language: "Estonian"
        },
        {
          code: "fi",
          language: "Finnish"
        },
        {
          code: "fr",
          language: "French"
        },
        {
          code: "fy",
          language: "Frisian"
        },
        {
          code: "gl",
          language: "Galician"
        },
        {
          code: "ka",
          language: "Georgian"
        },
        {
          code: "de",
          language: "German"
        },
        {
          code: "el",
          language: "Greek"
        },
        {
          code: "gu",
          language: "Gujarati"
        },
        {
          code: "ht",
          language: "Haitian Creole"
        },
        {
          code: "ha",
          language: "Hausa"
        },
        {
          code: "haw",
          language: "Hawaiian"
        },
        {
          code: "he or iw",
          language: "Hebrew"
        },
        {
          code: "hi",
          language: "Hindi"
        },
        {
          code: "hmn",
          language: "Hmong"
        },
        {
          code: "hu",
          language: "Hungarian"
        },
        {
          code: "is",
          language: "Icelandic"
        },
        {
          code: "ig",
          language: "Igbo"
        },
        {
          code: "id",
          language: "Indonesian"
        },
        {
          code: "ga",
          language: "Irish"
        },
        {
          code: "it",
          language: "Italian"
        },
        {
          code: "ja",
          language: "Japanese"
        },
        {
          code: "jv",
          language: "Javanese"
        },
        {
          code: "kn",
          language: "Kannada"
        },
        {
          code: "kk",
          language: "Kazakh"
        },
        {
          code: "km",
          language: "Khmer"
        },
        {
          code: "ko",
          language: "Korean"
        },
        {
          code: "ku",
          language: "Kurdish"
        },
        {
          code: "ky",
          language: "Kyrgyz"
        },
        {
          code: "lo",
          language: "Lao"
        },
        {
          code: "la",
          language: "Latin"
        },
        {
          code: "lv",
          language: "Latvian"
        },
        {
          code: "lt",
          language: "Lithuanian"
        },
        {
          code: "lb",
          language: "Luxembourgish"
        },
        {
          code: "mk",
          language: "Macedonian"
        },
        {
          code: "mg",
          language: "Malagasy"
        },
        {
          code: "ms",
          language: "Malay"
        },
        {
          code: "ml",
          language: "Malayalam"
        },
        {
          code: "mt",
          language: "Maltese"
        },
        {
          code: "mi",
          language: "Maori"
        },
        {
          code: "mr",
          language: "Marathi"
        },
        {
          code: "mn",
          language: "Mongolian"
        },
        {
          code: "my",
          language: "Myanmar (Burmese)"
        },
        {
          code: "ne",
          language: "Nepali"
        },
        {
          code: "no",
          language: "Norwegian"
        },
        {
          code: "ny",
          language: "Nyanja (Chichewa)"
        },
        {
          code: "ps",
          language: "Pashto"
        },
        {
          code: "fa",
          language: "Persian"
        },
        {
          code: "pl",
          language: "Polish"
        },
        {
          code: "pt",
          language: "Portuguese (Portugal, Brazil)"
        },
        {
          code: "pa",
          language: "Punjabi"
        },
        {
          code: "ro",
          language: "Romanian"
        },
        {
          code: "ru",
          language: "Russian"
        },
        {
          code: "sm",
          language: "Samoan"
        },
        {
          code: "gd",
          language: "Scots Gaelic"
        },
        {
          code: "sr",
          language: "Serbian"
        },
        {
          code: "st",
          language: "Sesotho"
        },
        {
          code: "sn",
          language: "Shona"
        },
        {
          code: "sd",
          language: "Sindhi"
        },
        {
          code: "si",
          language: "Sinhala (Sinhalese)"
        },
        {
          code: "sk",
          language: "Slovak"
        },
        {
          code: "sl",
          language: "Slovenian"
        },
        {
          code: "so",
          language: "Somali"
        },
        {
          code: "es",
          language: "Spanish"
        },
        {
          code: "su",
          language: "Sundanese"
        },
        {
          code: "sw",
          language: "Swahili"
        },
        {
          code: "sv",
          language: "Swedish"
        },
        {
          code: "tl",
          language: "Tagalog (Filipino)"
        },
        {
          code: "tg",
          language: "Tajik"
        },
        {
          code: "ta",
          language: "Tamil"
        },
        {
          code: "te",
          language: "Telugu"
        },
        {
          code: "th",
          language: "Thai"
        },
        {
          code: "tr",
          language: "Turkish"
        },
        {
          code: "uk",
          language: "Ukrainian"
        },
        {
          code: "ur",
          language: "Urdu"
        },
        {
          code: "uz",
          language: "Uzbek"
        },
        {
          code: "vi",
          language: "Vietnamese"
        },
        {
          code: "cy",
          language: "Welsh"
        },
        {
          code: "xh",
          language: "Xhosa"
        },
        {
          code: "yi",
          language: "Yiddish"
        },
        {
          code: "yo",
          language: "Yoruba"
        },
        {
          code: "zu",
          language: "Zulu"
        }
      ]
    };
  },
  methods: {
    onSelectFile() {
      this.initApp();
      this.$refs.fileInput.click();
    },

    uploadFile(evt) {
      const file = evt.target.files[0];
      const fileName = file.name;

      if (!fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
        this.showDialog(
          "Error: File Type",
          "Please upload an image file (jpg, png, gif)."
        );
      } else if (fileName.lastIndexOf(".") <= 0) {
        this.showDialog(
          "Error: File Name",
          "The file extension is incorrect. Please upload an image file with one of the following type (jpg, png, gif)."
        );
      } else {
        this.initTranslation();
        this.uploadedImgUrl = URL.createObjectURL(file);

        const metadata = {
          contentType: file.type
        };

        const docRef = db.collection("ocrTranslations").doc();

        const uploadFileName = docRef.id + "." + fileName.split(".").pop();

        const fileRef = storage.ref("img_to_ocr/" + uploadFileName);

        fileRef
          .put(file, metadata)
          .then(() => {
            this.firestoreDocListener = docRef.onSnapshot(doc => {
              if (doc.exists && doc.data().hasOwnProperty("translated")) {
                this.translatedText = doc.data().translated.en;
                this.originalLanguage = this.getLanguage(
                  doc.data().originalLanguage
                );
                this.showTranslationResult();
              }
            });
          })
          .catch(error => {
            this.showDialog("Error", error.message);
            this.initApp();
          });
      }
    },

    initApp() {
      this.showUploadButton = true;
      this.showCard = false;
      this.loading = false;
      this.showOCRResults = false;
    },

    initTranslation() {
      if (this.firestoreDocListener) this.firestoreDocListener(); //Calling the "listener function" -> it detaches the current Firestore document listener

      this.translatedText = "";
      this.originalLanguage = "";

      this.showUploadButton = false;
      this.loading = true;
      this.showCard = true;
    },

    showTranslationResult() {
      this.loading = false;
      this.showOCRResults = true;
      this.showUploadButton = true;
    },

    showDialog(title, text) {
      this.dialogTitle = title;
      this.dialogText = text;
      this.dialog = true;
    },

    hideDialog() {
      this.dialog = false;
    },

    generateUUID() {
      let d = new Date().getTime();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        d += performance.now();
      }
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    },

    getLanguage(code) {
      let obj = this.languageCodes.find(o => o.code === code);
      return obj.language;
    },

    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = "0em";
    },

    enter(el, done) {
      Velocity(
        el,
        { opacity: 1, height: "100%" },
        { duration: 2000, easing: "easeOutCubic", complete: done }
      );
    },

    leave(el, done) {
      Velocity(
        el,
        { opacity: 0, height: "0em" },
        { duration: 2000, easing: "easeInCubic", complete: done }
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview img {
  max-width: 100%;
  max-height: 500px;
}
</style>
