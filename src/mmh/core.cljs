(ns mmh.core
  (:require-macros [mmh.macros :refer [spy]])
  (:require [vdom.core :refer [renderer]]
            [mmh.ui :as ui]))

(enable-console-print!)

(defonce model
  (atom
    {:javascript ""
     :algorithm ""
     :initial ""}))

(defmulti emit (fn [t & _] t))

(defmethod emit 'eval/all [_ js algo init]
  (swap! model merge
    {:javascript js
     :algorithm algo
     :initial init}))

(defonce render!
  (let [r (renderer (.getElementById js/document "app"))]
    #(r (ui/main emit @model))))

(defonce on-update
  (add-watch model :rerender
    (fn [_ _ _ model]
      (render! model))))

(render! @model)

(comment
  (swap! model assoc :initial "5")
  (swap! model assoc :algorithm "dup")
  )
