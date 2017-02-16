select appid, count(*) NumberOfInstallations
from DeviceInstalledApp
where installed=1
group by appid