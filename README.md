
Dissertation: Utilizing Machine Learning Techniques to Forecast Player and Team PerformanceDissertation: Utilizing Machine Learning Techniques to Forecast Player and Team Performance

Abstract
This dissertation explores using machine learning to predict cricket player and team performance. The goal is to forecast runs scored by batsmen and match outcomes based on batting statistics. The project includes web scraping, data preprocessing, visualization, and applying machine learning models.

Data Collection
Data was collected from ESPN Cricinfo website using Node.js, focusing on ICC World Cup tournaments from 2002 to 2023. The dataset includes 5,204 records with 14 variables, covering various player and match statistics.

Data Preprocessing and Visualization
The data was cleaned and prepared in Python to handle missing values, normalize numbers, and convert categorical variables. Visualization techniques were used to find patterns and relationships in the data.

Machine Learning Models
Three machine learning models were used, and hyperparameter tuning was performed to optimize their performance:

Decision Tree
Random Forest
Gradient Boosting
Predicting Runs of Batsmen
The first task was to predict runs scored by batsmen. The results were:

Gradient Boosting: Accuracy 97.1%
Random Forest: Accuracy 94.81%
Decision Tree: Accuracy 94.56%
Predicting Match Outcomes
The second task was to predict match outcomes (win or loss) based on batting statistics. The results were:

Gradient Boosting: Accuracy 80.28%
Random Forest: Accuracy 77.46%
Decision Tree: Accuracy 66.20%

ROC Curve Analysis
ROC curve analysis showed Random Forest had a higher Area Under the Curve (AUC) of 0.84 compared to Gradient Boosting's 0.81. This indicates that Random Forest was more effective across various thresholds.

Conclusion
Machine learning models can effectively predict cricket performance metrics. Gradient Boosting performed best in accuracy. However, Random Forest showed a higher AUC in the ROC analysis, indicating strong performance across various thresholds. These findings are useful for teams, analysts, and fans to understand and predict cricket performance.
