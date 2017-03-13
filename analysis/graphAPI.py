import plotly.graph_objs as go
import plotly.offline as po
from plotly.graph_objs import *

def generate_bar_chart(frequency_token, number_of_word, title=None):

    token = ["Value: " + str(token_distri[0]) if isinstance(token_distri[0], int) else token_distri[0] for token_distri in frequency_token]
    frequency = [token_distri[1] for token_distri in frequency_token]
    distribution = [go.Bar(
            x=token[:number_of_word],
            y=frequency[:number_of_word]
    )]
    layout = go.Layout(
        title=title
    )
    fig = go.Figure(data=distribution, layout=layout)
    po.iplot(fig)