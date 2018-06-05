import json
from enum import (
    Enum,
    auto,
)


class UserRole(Enum):
    guest = auto()
    normal = auto()


class DongEncoder(json.JSONEncoder):
    prefix = "__enum__"

    def default(self, o):
        if isinstance(o, UserRole):
            return {self.prefix: o.name}
        else:
            return super().default(o)


def dong_decode(d):
    if DongEncoder.prefix in d:
        name = d[DongEncoder.prefix]
        return UserRole[name]
    else:
        return d
