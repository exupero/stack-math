(ns mmh.core
  (:require-macros [mmh.macros :refer [spy]])
  (:require [goog.crypt :as crypt]
            [goog.crypt.base64 :as b64]
            [cljs.reader :as reader]
            [clojure.string :as string]
            [vdom.core :refer [renderer]]
            [mmh.ui :as ui]))

(enable-console-print!)

(def parsed-hash
  (try
    (as-> js/window x
      (.-location x)
      (.-hash x)
      (string/replace x #"^#/" "")
      (b64/decodeStringToByteArray x true)
      (crypt/utf8ByteArrayToString x)
      (reader/read-string x))
    (catch js/Error e
      nil)))

(defonce model
  (atom
    (or parsed-hash
        {:javascript ""
         :algorithm ""
         :initial ""})))

(defmulti emit (fn [t & _] t))

(defmethod emit 'eval/all [_ js algo init]
  (swap! model merge
    {:javascript js
     :algorithm algo
     :initial init}))

(defonce render!
  (let [r (renderer (.getElementById js/document "app"))]
    #(r (ui/main emit @model))))

(defonce watch-for-rerender
  (add-watch model :rerender
    (fn [_ _ _ model]
      (render! model))))

(defonce watch-for-persist
  (add-watch model :persist
    (fn [_ _ _ model]
      (set! (-> js/window .-location .-hash)
        (as-> model x
          (pr-str x)
          (crypt/stringToUtf8ByteArray x)
          (b64/encodeByteArray x true)
          (str "/" x))))))

(render! @model)

(comment
  (swap! model assoc :initial "5")
  (swap! model assoc :algorithm "dup")
  )
