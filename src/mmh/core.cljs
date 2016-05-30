(ns mmh.core
  (:require-macros [mmh.macros :refer [spy]])
  (:require [goog.crypt.base64 :as b64]
            [cljs.reader :as reader]
            [clojure.string :as string]
            [vdom.core :refer [renderer]]
            [mmh.ui :as ui]))

(enable-console-print!)

(def parsed-hash
  (try
    (-> js/window .-location .-hash
      (string/replace #"^#/" "")
      b64/decodeString
      reader/read-string)
    (catch js/Exception e
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
        (str "/" (b64/encodeString (pr-str model)))))))

(render! @model)

(comment
  (swap! model assoc :initial "5")
  (swap! model assoc :algorithm "dup")
  )
