# -*- coding: utf-8 -*-
"""
    Lanai Colorscheme
    ~~~~~~~~~~~~~~~~~

    Converted by Vim Colorscheme Converter
"""
from pygments.style import Style
from pygments.token import Token, Comment, Name, Keyword, Generic, Number, Operator, String

class LanaiStyle(Style):

    background_color = '#0f1110'
    styles = {
        Token:              'noinherit #f2f8f8 bg:#0f1110',
        Comment.Preproc:    'noinherit #259acc bg:#05131a',
        Name.Entity:        'noinherit #c09bff bg:#13101a',
        Generic.Heading:    '#F9F9FF bg:#192224 bold',
        String:             'noinherit #fff290 bg:#1a190f',
        Name.Tag:           'noinherit #dc1c65 bg:#1a030c',
        Name.Exception:     'noinherit #dc1c65 bg:#1a030c',
        Name.Function:      'noinherit #89e71e bg:#101a03',
        Generic.Traceback:  'noinherit #f2f8f8 bg:#a80043',
        Name.Variable:      'noinherit #95ddff bg:#0f171a',
        Generic.Subheading: '#F9F9FF bg:#192224 bold',
        Generic.Output:     'noinherit #5E6C70 italic',
        Generic.Error:      'noinherit #A1A6A8 bg:#912C00',
        Keyword:            'noinherit #dc1c65 bg:#1a030c',
        Generic.Inserted:   'noinherit #f2f8f8 bg:#5c7441',
        Number.Float:       'noinherit #c09bff bg:#0d061a',
        Keyword.Type:       'noinherit #269acc bg:#05131a',
        Name.Constant:      'noinherit #c09bff bg:#13101a',
        Generic.Emph:       '#F9F9FF bg:#192224 underline',
        Comment:            'noinherit #444b48 italic',
        Name.Attribute:     'noinherit #89e71e bg:#101a03',
        Number:             'noinherit #c09bff bg:#0d061a',
        Name.Label:         '#DC1C67 bg:#1a030c bold',
        Generic.Deleted:    'noinherit #f2f8f8 bg:#a80043',
        Operator.Word:      'noinherit #ff9721 bg:#1a0f03',
    }
