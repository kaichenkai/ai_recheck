from warnings import warn

warn("IPython.tools.daemonize has moved to ipyparallel.apps.daemonize", stacklevel=2)
from ipyparallel.apps.daemonize import daemonize
