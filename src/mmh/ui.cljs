(ns mmh.ui
  (:require-macros [mmh.macros :refer [spy]])
  (:require [clojure.string :as string]
            [mmh.parse :as p]
            [mmh.evaluate :as e]))

(defn value [id]
  (.-value (.getElementById js/document id)))

(defn steps [left right]
  (let [[left] (reduce e/step [] (p/ast (p/tokens left)))
        right (p/ast (p/tokens right))]
    (e/steps left right)))

(defn error [actual value]
  (if (= actual value)
    0
    (.abs js/Math
          (/ (- actual value)
             actual))))

(defn round
  ([x] (round x 1))
  ([x m]
   (* m (.round js/Math (/ x m)))))

(defn steps-table [steps]
  [:table {}
   (for [[left right] steps]
     [:tr {}
      [:td {:className "t-right"}
       (string/join " " left)]
      [:td {:className "t-muted"}
       " ◆ "]
      [:td {}
       (string/join " " right)]])])

(defn main [emit model]
  (let [ss
        (try
          (steps (model :initial) (model :algorithm))
          (catch js/Error e (.-message e)))
        js-result
        (when (seq (model :javascript))
          (js/eval (str "var x=" (model :initial) ";" (model :javascript))))
        stack-result (-> ss last first last)]
    [:main {:className "l-diptych"}
     [:div {:className "l-vspaced"}
      [:div {:classname "l-width-full"}
       "JavaScript expression of "
       [:code {} "x"]
       [:div {}
        [:input {:id "input-js"
                 :className "l-width-full"
                 :value (model :javascript)}]]]
      [:div {}
       "Stack algorithm"
       [:div {}
        [:textarea {:id "input-algorithm"
                    :className "l-width-full"
                    :value (model :algorithm)}]]]
      [:div {}
       "Initial stack"
       [:div {}
        [:input {:id "input-init"
                 :className "l-width-full"
                 :value (model :initial)}]]]
      [:div {}
       [:button
        {:onclick #(emit 'eval/all (value "input-js") (value "input-algorithm") (value "input-init"))}
        "Evaluate"]]]
     [:div {:className "l-vspaced"}
      (when (and js-result)
        [:div {}
         [:span {:className "t-muted"} "JavaScript result "]
         (round js-result 0.0001)])
      (when (not (nil? (ffirst ss)))
        [:div {}
         [:span {:className "t-muted"} "Stack evaluation "]
         (if (string? ss)
           [:text {:className "t-error"} ss]
           (steps-table ss))])
      (when (and (seq (model :javascript))
                 (not (string? ss)))
        [:div {}
         [:span {:className "t-muted"} "Error "]
         (round (* 100 (error js-result stack-result)) 0.1)
         "%"])]]))
