"""
Settings used by recode2s project.

This consists of the general production settings, with an optional import of any local
settings.
"""

# Import production settings.
from recode2s.settings.production import *

# Import optional local settings.
try:
    from recode2s.settings.local import *
except ImportError:
    pass
