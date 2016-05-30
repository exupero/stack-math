(ns mmh.ui
  (:require-macros [mmh.macros :refer [spy]])
  (:require [clojure.string :as string]
            [mmh.analysis :as a]
            [mmh.parse :as p]
            [mmh.evaluate :as e]))

(defn value [id]
  (.-value (.getElementById js/document id)))

(defn round
  ([x] (round x 1))
  ([x m]
   (* m (js/Math.round (/ x m)))))

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

(def magnitude-guesses
  [[0.009 0.011]
   [-0.009 0.011]
   [0.09 0.11]
   [-0.09 -0.11]
   [0.9 1.1]
   [-0.9 -1.1]
   [9.9 10.1]
   [-9.9 -10.1]
   [99.9 100.1]
   [-99.9 -100.1]
   [999.9 1000.1]
   [-999.9 -1000.1]
   [9999.9 10000.1]
   [-9999.9 -10000.1]
   [99999.9 100000.1]
   [-99999.9 -100000.1]])

(defn error-desc [actual estimate]
  (let [zeros (a/zeros
                (a/errorf actual estimate 0.05)
                a/secant-method
                magnitude-guesses)]
    (pr-str zeros)
    ))

(defn graph [f]
  (let [[w h] [300 100]]
    [:svg
     {:width w
      :height h}
     [:path
      {:d "M0,0L5,5"
       :stroke "red"}]
     ])
  )

(defn main [emit model]
  (let [args (->> model :initial p/tokens p/ast (reduce e/step []) first)
        steps (try
                (e/steps args (-> model :algorithm p/tokens p/ast))
                (catch js/Error e (.-message e)))
        js-fn (if (seq (model :javascript))
                (e/js->fn (model :javascript))
                (constantly nil))
        js-result (apply js-fn args)
        stack-fn (if (seq (model :algorithm))
                   (e/stack->fn (-> model :algorithm p/tokens p/ast))
                   (constantly nil))
        stack-result (apply stack-fn args)]
    [:main {}
     [:div {:className "l-diptych"}
      [:div {:className "l-vspaced"}
       [:div {:classname "l-width-full"}
        "JavaScript expression of "
        [:code {} "x"]
        [:div {}
         [:textarea {:id "input-js"
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
       (when js-result
         [:div {}
          [:span {:className "t-muted"} "JavaScript result "]
          (round js-result 0.0001)])
       (when (not (nil? (ffirst steps)))
         [:div {}
          [:span {:className "t-muted"} "Stack evaluation "]
          (if (string? steps)
            [:text {:className "t-error"} steps]
            (steps-table steps))])
       (when (and (seq (model :javascript))
                  (not (string? steps)))
         (list
           [:div {}
            [:span {:className "t-muted"} "Error "]
            (round (* 100 (a/error js-result stack-result)) 0.1) "%"]
           #_[:div {}
            (graph (a/errorf js-fn stack-fn 0.05))
            ]))]]]))
