import math
import numpy as np
import pandas as pd
from flask import jsonify

def sanitize_value(val):
    """Recursively replaces NaN, Infinity, and numpy datatypes with JSON-compliant values."""
    if val is None:
        return None
    if isinstance(val, (float, np.floating)):
        if math.isnan(val) or np.isnan(val):
            return None
        if math.isinf(val) or np.isinf(val):
            return None
        return float(val)
    if isinstance(val, (int, np.integer)):
        return int(val)
    if isinstance(val, (bool, np.bool_)):
        return bool(val)
    if isinstance(val, (pd.Timestamp, pd.Timedelta)):
        return str(val)
    if isinstance(val, dict):
        return {k: sanitize_value(v) for k, v in val.items()}
    if isinstance(val, (list, tuple, set, pd.Series, np.ndarray)):
        return [sanitize_value(v) for v in val]
    return val

def api_response(data=None, meta=None, error=None, status=200):
    """Formats standardized JSON API envelope: {data, meta, error}."""
    payload = {
        "data": sanitize_value(data),
        "meta": sanitize_value(meta or {}),
        "error": error
    }
    return jsonify(payload), status

def error_response(message, status=400, details=None):
    """Formats standardized error JSON response without exposing system internals."""
    payload = {
        "data": None,
        "meta": {},
        "error": {
            "message": str(message),
            "status": status,
            "details": sanitize_value(details)
        }
    }
    return jsonify(payload), status
